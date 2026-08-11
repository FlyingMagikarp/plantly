import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import {
  RouterProvider,
  createMemoryRouter,
  useParams,
} from 'react-router-dom';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import {
  SpeciesDetailError,
  SpeciesDetailRoute,
} from './species-detail';
import {
  type SpeciesDetail,
  speciesDetailLoader,
} from './species-detail-loader';
import { SpeciesListError, SpeciesListRoute } from './species-list';
import {
  type SpeciesOverviewItem,
  speciesListLoader,
} from './species-list-loader';

const server = setupServer();
const apiOrigin = 'http://localhost';

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
  const interceptedFetch = globalThis.fetch;
  vi.stubGlobal(
    'fetch',
    (input: RequestInfo | URL, init?: RequestInit) =>
      interceptedFetch(
        typeof input === 'string' ? new URL(input, apiOrigin) : input,
        init,
      ),
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

describe('UC-003: List Species', () => {
  it('displays active and archived species identity, status, and plant count by default', async () => {
    respondWithOverview([
      overviewSpecies({ id: 2, name: 'Active Hoya', plantCount: 0 }),
      overviewSpecies({
        id: 7,
        name: 'Archived Fern',
        archived: true,
        plantCount: 3,
      }),
    ]);

    renderSpeciesApp('/species');

    expect(await screen.findByRole('link', { name: /Active Hoya/ })).toHaveTextContent(
      'SP-002 · Active',
    );
    expect(
      within(screen.getByRole('link', { name: /Active Hoya/ })).getByText('0'),
    ).toBeInTheDocument();
    expect(
      within(screen.getByRole('link', { name: /Active Hoya/ })).getByText('plants'),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Archived Fern/ })).toHaveTextContent(
      'SP-007 · Archived',
    );
    expect(
      within(screen.getByRole('link', { name: /Archived Fern/ })).getByText('3'),
    ).toBeInTheDocument();
  });

  it('excludes archived species and includes them again when the filter is disabled', async () => {
    respondWithOverview([
      overviewSpecies({ id: 1, name: 'Active Hoya' }),
      overviewSpecies({ id: 2, name: 'Archived Fern', archived: true }),
    ]);
    renderSpeciesApp('/species');
    await screen.findByText('Archived Fern');

    const filter = screen.getByRole('checkbox', {
      name: 'Exclude archived species',
    });
    fireEvent.click(filter);
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
    await waitFor(() => expect(screen.queryByText('Archived Fern')).not.toBeInTheDocument());
    expect(screen.getByText('Active Hoya')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('checkbox', { name: 'Exclude archived species' }));
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
    expect(await screen.findByText('Archived Fern')).toBeInTheDocument();
  });

  it.each([
    ['identifier ascending', '?sort=id&direction=asc', ['Alpha', 'Zebra', 'Middle']],
    ['identifier descending', '?sort=id&direction=desc', ['Middle', 'Zebra', 'Alpha']],
    ['name ascending', '?sort=name&direction=asc', ['Alpha', 'Middle', 'Zebra']],
    ['name descending', '?sort=name&direction=desc', ['Zebra', 'Middle', 'Alpha']],
    ['plant count ascending', '?sort=plantCount&direction=asc', ['Middle', 'Alpha', 'Zebra']],
    ['plant count descending', '?sort=plantCount&direction=desc', ['Zebra', 'Alpha', 'Middle']],
  ])('sorts species by %s', async (_description, query, expectedNames) => {
    respondWithOverview([
      overviewSpecies({ id: 1, name: 'Alpha', plantCount: 2 }),
      overviewSpecies({ id: 2, name: 'Zebra', plantCount: 4 }),
      overviewSpecies({ id: 3, name: 'Middle', plantCount: 0 }),
    ]);

    renderSpeciesApp(`/species${query}`);
    await screen.findByText('Alpha');

    expect(speciesRowNames()).toEqual(expectedNames);
  });

  it('applies sorting only to active species while archived species are excluded', async () => {
    respondWithOverview([
      overviewSpecies({ id: 1, name: 'Beta' }),
      overviewSpecies({ id: 2, name: 'Archived', archived: true }),
      overviewSpecies({ id: 3, name: 'Alpha' }),
    ]);

    renderSpeciesApp(
      '/species?excludeArchived=true&sort=name&direction=asc',
    );
    await screen.findByText('Alpha');

    expect(speciesRowNames()).toEqual(['Alpha', 'Beta']);
    expect(screen.queryByText('Archived')).not.toBeInTheDocument();
  });

  it.each([
    ['no species exist', '/species', [], 'No species yet'],
    [
      'the active filter has no matches',
      '/species?excludeArchived=true',
      [overviewSpecies({ archived: true, name: 'Archived' })],
      'No active species',
    ],
  ])('shows the appropriate empty state when %s', async (_case, entry, data, message) => {
    respondWithOverview(data as SpeciesOverviewItem[]);

    renderSpeciesApp(entry as string);

    expect(await screen.findByRole('heading', { name: message as string })).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('communicates an unavailable overview and retries successfully', async () => {
    let attempts = 0;
    server.use(
      http.get(`${apiOrigin}/api/species`, () => {
        attempts += 1;
        return attempts === 1
          ? new HttpResponse(null, { status: 500 })
          : HttpResponse.json([overviewSpecies({ name: 'Recovered Hoya' })]);
      }),
    );

    renderSpeciesApp('/species');
    expect(
      await screen.findByRole('heading', { name: 'Species could not be loaded' }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));

    expect(await screen.findByText('Recovered Hoya')).toBeInTheDocument();
    expect(attempts).toBe(2);
  });

  it('uses only read requests while filtering and sorting', async () => {
    const methods: string[] = [];
    server.use(
      http.get(`${apiOrigin}/api/species`, ({ request }) => {
        methods.push(request.method);
        return HttpResponse.json([overviewSpecies()]);
      }),
    );
    renderSpeciesApp('/species');
    await screen.findByText('Test Species');

    fireEvent.change(screen.getByLabelText('Sort by'), {
      target: { value: 'name' },
    });
    fireEvent.click(screen.getByLabelText('Exclude archived species'));
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
    await waitFor(() => expect(methods.length).toBe(2));

    expect(methods).toEqual(['GET', 'GET']);
  });
});

describe('UC-002: View Species', () => {
  it('opens the selected archived species and displays all care knowledge and notes', async () => {
    respondWithOverview([
      overviewSpecies({ id: 7, name: 'Selected Species', archived: true }),
    ]);
    respondWithDetail(
      detailSpecies({ id: 7, name: 'Selected Species', archived: true }),
    );
    renderSpeciesApp('/species');

    fireEvent.click(await screen.findByRole('link', { name: /Selected Species/ }));

    expect(await screen.findByRole('heading', { name: 'Selected Species' })).toBeInTheDocument();
    expect(screen.getByText('Archived')).toBeInTheDocument();
    for (const expected of [
      'Slightly Dry',
      'Bright Indirect',
      '15–29 °C',
      '10 °C',
      'March September',
      'August October',
      'November February',
      'Balanced',
      'Bloom',
      'None',
      'First note.',
      'Second note.',
    ]) {
      expect(screen.getAllByText(expected).length).toBeGreaterThan(0);
    }
  });

  it('lists every associated plant after species data and opens the selected plant route', async () => {
    respondWithDetail(
      detailSpecies({
        plants: [
          { id: 11, nickname: 'Kitchen Hoya' },
          { id: 12, nickname: 'Office Hoya' },
        ],
      }),
    );
    renderSpeciesApp('/species/1');

    expect(await screen.findByRole('heading', { name: 'Plants' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Kitchen Hoya' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('link', { name: 'Office Hoya' }));

    expect(await screen.findByRole('heading', { name: 'Plant 12' })).toBeInTheDocument();
  });

  it('omits the plant section and communicates when no notes are defined', async () => {
    respondWithDetail(detailSpecies({ notes: [], plants: [] }));
    renderSpeciesApp('/species/1');

    expect(await screen.findByText('No notes are defined for this species.')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Plants' })).not.toBeInTheDocument();
  });

  it('communicates that a missing species was not found without showing other data', async () => {
    server.use(
      http.get(`${apiOrigin}/api/species/404`, () =>
        HttpResponse.json({ name: 'Wrong Species' }, { status: 404 }),
      ),
    );
    renderSpeciesApp('/species/404');

    expect(await screen.findByRole('heading', { name: 'Species not found' })).toBeInTheDocument();
    expect(screen.queryByText('Wrong Species')).not.toBeInTheDocument();
  });

  it('communicates an unavailable detail and retries successfully', async () => {
    let attempts = 0;
    server.use(
      http.get(`${apiOrigin}/api/species/1`, () => {
        attempts += 1;
        return attempts === 1
          ? new HttpResponse(null, { status: 500 })
          : HttpResponse.json(detailSpecies({ name: 'Recovered Species' }));
      }),
    );
    renderSpeciesApp('/species/1');
    expect(
      await screen.findByRole('heading', { name: 'Species could not be loaded' }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));

    expect(await screen.findByRole('heading', { name: 'Recovered Species' })).toBeInTheDocument();
    expect(attempts).toBe(2);
  });

  it('uses only read requests while viewing species and navigating to a plant', async () => {
    const methods: string[] = [];
    server.use(
      http.get(`${apiOrigin}/api/species/1`, ({ request }) => {
        methods.push(request.method);
        return HttpResponse.json(
          detailSpecies({ plants: [{ id: 4, nickname: 'Linked Plant' }] }),
        );
      }),
    );
    renderSpeciesApp('/species/1');
    fireEvent.click(await screen.findByRole('link', { name: 'Linked Plant' }));
    await screen.findByRole('heading', { name: 'Plant 4' });

    expect(methods).toEqual(['GET']);
  });
});

function renderSpeciesApp(initialEntry: string) {
  const router = createMemoryRouter(
    [
      {
        path: '/species',
        element: <SpeciesListRoute />,
        loader: speciesListLoader,
        errorElement: <SpeciesListError />,
      },
      {
        path: '/species/:speciesId',
        element: <SpeciesDetailRoute />,
        loader: speciesDetailLoader,
        errorElement: <SpeciesDetailError />,
      },
      { path: '/plants/:plantId', element: <PlantDestination /> },
    ],
    { initialEntries: [initialEntry] },
  );

  render(<RouterProvider router={router} />);
  return router;
}

function PlantDestination() {
  const { plantId } = useParams();
  return <h1>Plant {plantId}</h1>;
}

function respondWithOverview(species: SpeciesOverviewItem[]) {
  server.use(
    http.get(`${apiOrigin}/api/species`, () => HttpResponse.json(species)),
  );
}

function respondWithDetail(species: SpeciesDetail) {
  server.use(
    http.get(`${apiOrigin}/api/species/${species.id}`, () =>
      HttpResponse.json(species),
    ),
  );
}

function overviewSpecies(
  overrides: Partial<SpeciesOverviewItem> = {},
): SpeciesOverviewItem {
  return {
    id: 1,
    name: 'Test Species',
    archived: false,
    plantCount: 0,
    ...overrides,
  };
}

function detailSpecies(overrides: Partial<SpeciesDetail> = {}): SpeciesDetail {
  return {
    id: 1,
    name: 'Test Species',
    archived: false,
    moisture: 'slightly-dry',
    light: 'bright-indirect',
    preferredTemperatureMin: 15,
    preferredTemperatureMax: 29,
    minimumTemperature: 10,
    growthPeriod: 'March-September',
    bloomPeriod: 'August-October',
    dormancyPeriod: 'November-February',
    growthFertilizer: 'balanced',
    bloomFertilizer: 'bloom',
    dormancyFertilizer: 'none',
    notes: ['First note.', 'Second note.'],
    plants: [],
    ...overrides,
  };
}

function speciesRowNames(): string[] {
  return screen.getAllByRole('listitem').map((item) => {
    const link = within(item).getByRole('link');
    return link.querySelector('span > span')?.textContent ?? '';
  });
}
