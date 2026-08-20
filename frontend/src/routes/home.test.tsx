import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { AppShell } from '../components/app-shell';
import { HomeRoute } from './home';
import { homeLoader } from './home-loader';
import type { LocationOption, PlantItem, SpeciesOption } from './plants-data';
import { PlantsError } from './plants-common';

const server = setupServer();
const apiOrigin = 'http://localhost';

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
  const interceptedFetch = globalThis.fetch;
  vi.stubGlobal('fetch', (input: RequestInfo | URL, init?: RequestInit) =>
    interceptedFetch(typeof input === 'string' ? new URL(input, apiOrigin) : input, init),
  );
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
});

afterAll(() => {
  vi.unstubAllGlobals();
  server.close();
});

describe('UC-034: View Home Plant Overview', () => {
  it('groups every active plant exactly once with No location first and excludes inactive plants', async () => {
    const shelf = locationFixture({ name: 'Shelf' });
    const state = apiState({
      locations: [shelf],
      plants: [
        plantFixture({ nickname: 'Unassigned' }),
        plantFixture({ id: 2, nickname: 'Assigned', location: shelf }),
        plantFixture({ id: 3, nickname: 'Dead hidden', status: 'dead', location: shelf }),
        plantFixture({ id: 4, nickname: 'Archived hidden', status: 'archived' }),
      ],
    });
    serveApi(state);
    renderHome();
    await screen.findByText('Assigned');

    expect(screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)).toEqual(['No location', 'Shelf']);
    expect(screen.getAllByText('Unassigned')).toHaveLength(1);
    expect(screen.getAllByText('Assigned')).toHaveLength(1);
    expect(screen.queryByText('Dead hidden')).not.toBeInTheDocument();
    expect(screen.queryByText('Archived hidden')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Assigned/ })).toHaveAttribute('href', '/plants/2');
    expect(screen.getAllByText('Test Species')).toHaveLength(2);
  });

  it('keeps an empty No location group first when all active plants are assigned', async () => {
    const shelf = locationFixture({ name: 'Shelf' });
    serveApi(apiState({ locations: [shelf], plants: [plantFixture({ location: shelf })] }));
    renderHome();

    expect(await screen.findByText('No active plants are unassigned.')).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 2 })[0]).toHaveTextContent('No location');
  });

  it('guides an empty collection to Add Plant and performs only reads', async () => {
    const methods: string[] = [];
    serveApi(apiState(), methods);
    renderHome();

    expect(await screen.findByRole('heading', { name: 'No active plants' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Add plant' })).toHaveAttribute('href', '/plants/new');
    expect(methods).toEqual(['GET', 'GET', 'GET']);
  });

  it('communicates an unavailable overview and recovers on retry', async () => {
    const state = apiState({ plants: [plantFixture()] });
    let attempts = 0;
    server.use(
      http.get(`${apiOrigin}/api/plants`, () => attempts++ === 0 ? new HttpResponse(null, { status: 500 }) : HttpResponse.json(state.plants)),
      http.get(`${apiOrigin}/api/species`, () => HttpResponse.json(state.species)),
      http.get(`${apiOrigin}/api/locations`, () => HttpResponse.json(state.locations)),
    );
    renderHome();

    expect(await screen.findByRole('heading', { name: 'Plants could not be loaded' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByText('Test Hoya')).toBeInTheDocument();
    expect(attempts).toBe(2);
  });

  it('does not present or serve the retired plants-by-location entry point', async () => {
    serveApi(apiState());
    const router = renderHome('/plants/by-location');
    expect(await screen.findByRole('heading', { name: 'Plant detail' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/plants/by-location');
    expect(screen.queryByRole('link', { name: /view by location/i })).not.toBeInTheDocument();
  });
});

describe('UC-035: View Latest Care on Home', () => {
  it('shows the latest care date and the exact empty label while excluding inactive plants with newer care', async () => {
    const latest = '2026-08-19T21:30:00.000Z';
    serveApi(apiState({ plants: [
      plantFixture({ nickname: 'Cared plant', latestCareTimestamp: latest }),
      plantFixture({ id: 2, nickname: 'Never cared', latestCareTimestamp: null }),
      plantFixture({ id: 3, nickname: 'Dead cared', status: 'dead', latestCareTimestamp: '2026-08-20T08:00:00.000Z' }),
    ] }));
    renderHome();

    const cared = await screen.findByRole('link', { name: /Cared plant/ });
    expect(cared).toHaveTextContent(new Date(latest).toLocaleDateString());
    expect(cared.querySelector('time')).toHaveAttribute('datetime', latest);
    expect(screen.getByRole('link', { name: /Never cared/ })).toHaveTextContent('No CareLog yet');
    expect(screen.queryByText('Dead cared')).not.toBeInTheDocument();
  });

  it('treats latest-care retrieval failure as an unavailable overview and retries without stale values', async () => {
    const state = apiState({ plants: [plantFixture({ latestCareTimestamp: '2026-08-19T08:00:00.000Z' })] });
    let attempts = 0;
    server.use(
      http.get(`${apiOrigin}/api/plants`, () => attempts++ === 0 ? new HttpResponse(null, { status: 500 }) : HttpResponse.json(state.plants)),
      http.get(`${apiOrigin}/api/species`, () => HttpResponse.json(state.species)),
      http.get(`${apiOrigin}/api/locations`, () => HttpResponse.json(state.locations)),
    );
    renderHome();
    expect(await screen.findByRole('heading', { name: 'Plants could not be loaded' })).toBeInTheDocument();
    expect(screen.queryByText(/Last care/)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByText(/Last care/)).toBeInTheDocument();
  });
});

describe('UC-036: View Latest Plant Image on Home', () => {
  it('shows only the supplied newest image, omits empty image UI, and excludes inactive plants and their images', async () => {
    const methods: string[] = [];
    serveApi(apiState({ plants: [
      plantFixture({ nickname: 'Pictured', latestImageUrl: '/api/plants/1/images/9/content' }),
      plantFixture({ id: 2, nickname: 'No image', latestImageUrl: null }),
      plantFixture({ id: 3, nickname: 'Dead pictured', status: 'dead', latestImageUrl: '/api/plants/3/images/10/content' }),
      plantFixture({ id: 4, nickname: 'Archived pictured', status: 'archived', latestImageUrl: '/api/plants/4/images/11/content' }),
    ] }), methods);
    renderHome();

    const image = await screen.findByRole('img', { name: 'Latest image of Pictured' });
    expect(image).toHaveAttribute('src', '/api/plants/1/images/9/content');
    expect(screen.getByRole('link', { name: /Pictured/ }).querySelectorAll('img')).toHaveLength(1);
    expect(screen.getByRole('link', { name: /No image/ }).querySelector('img')).toBeNull();
    expect(screen.queryByText(/no images/i)).not.toBeInTheDocument();
    expect(screen.queryByText('Dead pictured')).not.toBeInTheDocument();
    expect(screen.queryByText('Archived pictured')).not.toBeInTheDocument();
    expect(methods).toEqual(['GET', 'GET', 'GET']);
  });

  it('removes unavailable image content while keeping the plant card usable', async () => {
    serveApi(apiState({ plants: [plantFixture({ latestImageUrl: '/api/plants/1/images/9/content' })] }));
    renderHome();

    const image = await screen.findByRole('img', { name: 'Latest image of Test Hoya' });
    fireEvent.error(image);

    expect(screen.queryByRole('img', { name: 'Latest image of Test Hoya' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Test Hoya/ })).toHaveAttribute('href', '/plants/1');
  });
});

function renderHome(entry = '/') {
  const router = createMemoryRouter([{
    element: <AppShell />,
    children: [
      { path: '/', element: <HomeRoute />, loader: homeLoader, errorElement: <PlantsError area="home" /> },
      { path: '/plants/:plantId', element: <h1>Plant detail</h1> },
      { path: '*', element: <p>No route matches</p> },
    ],
  }], { initialEntries: [entry] });
  render(<RouterProvider router={router} />);
  return router;
}

interface ApiState { plants: PlantItem[]; species: SpeciesOption[]; locations: LocationOption[] }
function serveApi(state: ApiState, methods?: string[]) {
  server.use(
    http.get(`${apiOrigin}/api/plants`, ({ request }) => { methods?.push(request.method); return HttpResponse.json(state.plants); }),
    http.get(`${apiOrigin}/api/species`, ({ request }) => { methods?.push(request.method); return HttpResponse.json(state.species); }),
    http.get(`${apiOrigin}/api/locations`, ({ request }) => { methods?.push(request.method); return HttpResponse.json(state.locations); }),
  );
}
function apiState(overrides: Partial<ApiState> = {}): ApiState { return { plants: [], species: [speciesFixture()], locations: [], ...overrides }; }
function speciesFixture(overrides: Partial<SpeciesOption> = {}): SpeciesOption { return { id: 1, name: 'Test Species', archived: false, ...overrides }; }
function locationFixture(overrides: Partial<LocationOption> = {}): LocationOption { return { id: 1, name: 'Test location', ...overrides }; }
function plantFixture(overrides: Partial<PlantItem> = {}): PlantItem { return { id: 1, nickname: 'Test Hoya', acquisitionDate: '2024-04-05', notes: null, status: 'active', species: speciesFixture(), location: null, ...overrides }; }
