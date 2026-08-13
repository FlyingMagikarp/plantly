import {
  cleanup,
  fireEvent,
  render,
  screen,
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
import { PlantCollectionRoute } from './plant-collection';
import { PlantDetailRoute } from './plant-detail';
import { PlantFormRoute } from './plant-form';
import { PlantsByLocationRoute } from './plants-by-location';
import { PlantsError } from './plants-common';
import {
  type LocationOption,
  type PlantItem,
  type SpeciesOption,
  plantCollectionLoader,
  plantDetailAction,
  plantDetailLoader,
  plantFormAction,
  plantFormLoader,
} from './plants-data';

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

describe('UC-004: Add Plant to Collection', () => {
  it('offers only active species, submits all fields, and opens the created detail', async () => {
    const state = apiState({
      species: [speciesFixture({ id: 1, name: 'Active Hoya' }), speciesFixture({ id: 2, name: 'Archived Fern', archived: true })],
    });
    serveApi(state);
    renderPlantsApp('/plants/new');

    expect(await screen.findByRole('heading', { name: 'Add a plant' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Active Hoya' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: /Archived Fern/ })).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Nickname'), { target: { value: 'Kitchen Hoya' } });
    fireEvent.change(screen.getByLabelText('Species'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText('Acquisition date'), { target: { value: '2024-04-05' } });
    fireEvent.change(screen.getByLabelText(/Notes/), { target: { value: 'Near the sink.' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add plant' }));

    expect(await screen.findByRole('heading', { name: 'Kitchen Hoya' })).toBeInTheDocument();
    expect(screen.getByText('Near the sink.')).toBeInTheDocument();
    expect(state.plants).toHaveLength(1);
    expect(state.plants[0]).toMatchObject({ acquisitionDate: '2024-04-05', notes: 'Near the sink.', status: 'active' });
  });

  it('communicates that an active species is required when none exists', async () => {
    const state = apiState({ species: [speciesFixture({ archived: true })] });
    serveApi(state);
    renderPlantsApp('/plants/new');

    expect(await screen.findByRole('heading', { name: 'An active species is required' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Add plant' })).not.toBeInTheDocument();
    expect(state.plants).toEqual([]);
  });

  it('identifies an unavailable species, preserves entries, and allows retry', async () => {
    const state = apiState();
    let attempts = 0;
    serveApi(state, {
      create: async ({ request }) => {
        attempts += 1;
        if (attempts === 1) return new HttpResponse(null, { status: 409 });
        const body = (await request.json()) as { nickname: string; speciesId: number; acquisitionDate: string; notes: string };
        const created = plantFixture({ id: 9, ...body, species: state.species[0] });
        state.plants.push(created);
        return HttpResponse.json(created, { status: 201 });
      },
    });
    renderPlantsApp('/plants/new');
    await screen.findByRole('heading', { name: 'Add a plant' });
    fireEvent.change(screen.getByLabelText('Nickname'), { target: { value: 'Retry Hoya' } });
    fireEvent.change(screen.getByLabelText('Species'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText('Acquisition date'), { target: { value: '2024-01-01' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add plant' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Select an active species');
    expect(screen.getByLabelText('Nickname')).toHaveValue('Retry Hoya');
    expect(state.plants).toEqual([]);
    fireEvent.click(screen.getByRole('button', { name: 'Add plant' }));
    expect(await screen.findByRole('heading', { name: 'Retry Hoya' })).toBeInTheDocument();
    expect(attempts).toBe(2);
  });
});

describe('UC-005: Update Plant', () => {
  it('shows current values, retains an archived current species, clears notes, and opens updated detail', async () => {
    const archived = speciesFixture({ id: 1, name: 'Archived Hoya', archived: true });
    const active = speciesFixture({ id: 2, name: 'Active Fern' });
    const state = apiState({ species: [archived, active], plants: [plantFixture({ species: archived, notes: 'Clear this' })] });
    serveApi(state);
    renderPlantsApp('/plants/1/edit');

    expect(await screen.findByLabelText('Nickname')).toHaveValue('Test Hoya');
    expect(screen.getByRole('option', { name: /Archived Hoya.*current species/ })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Active Fern' })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Nickname'), { target: { value: 'Updated fern' } });
    fireEvent.change(screen.getByLabelText('Species'), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText(/Notes/), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(await screen.findByRole('heading', { name: 'Updated fern' })).toBeInTheDocument();
    expect(screen.getByText('No notes recorded.')).toBeInTheDocument();
    expect(state.plants[0]).toMatchObject({ id: 1, status: 'active', notes: null, species: active });
  });

  it('preserves edited entries after a failed update so it can be retried', async () => {
    const state = apiState({ plants: [plantFixture()] });
    serveApi(state, { update: () => new HttpResponse(null, { status: 500 }) });
    renderPlantsApp('/plants/1/edit');
    await screen.findByLabelText('Nickname');
    fireEvent.change(screen.getByLabelText('Nickname'), { target: { value: 'Still entered' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Nothing was changed');
    expect(screen.getByLabelText('Nickname')).toHaveValue('Still entered');
    expect(state.plants[0].nickname).toBe('Test Hoya');
  });
});

describe('UC-007: View Plant', () => {
  it('opens a collection entry and displays every maintained field and active action', async () => {
    const location = locationFixture({ name: 'Window shelf' });
    const state = apiState({ plants: [plantFixture({ notes: 'Trailing growth.', location })], locations: [location] });
    serveApi(state);
    renderPlantsApp('/plants');
    fireEvent.click(await screen.findByRole('link', { name: /Test Hoya/ }));

    await screen.findByText('Plant 1');
    expect(screen.getByRole('heading', { name: 'Test Hoya' })).toBeInTheDocument();
    for (const text of ['Plant 1', 'Test Species', '2024-04-05', 'Active', 'Window shelf', 'Trailing growth.']) {
      expect(screen.getAllByText(text).length).toBeGreaterThan(0);
    }
    expect(screen.getByRole('link', { name: 'Edit plant' })).toHaveAttribute('href', '/plants/1/edit');
    expect(screen.getByText('Change location')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mark dead' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Archive plant' })).toBeInTheDocument();
  });

  it('shows archived species links, missing optional data, and only restoration for inactive plants', async () => {
    const archived = speciesFixture({ name: 'Archived Species', archived: true });
    const state = apiState({ species: [archived], plants: [plantFixture({ status: 'dead', species: archived, notes: null, location: null })] });
    serveApi(state);
    renderPlantsApp('/plants/1');

    expect(await screen.findByRole('link', { name: 'Archived Species (archived)' })).toHaveAttribute('href', '/species/1');
    expect(screen.getByText('No notes recorded.')).toBeInTheDocument();
    expect(screen.getByText('No location assigned')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Restore to active' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Edit plant' })).not.toBeInTheDocument();
    expect(screen.queryByText('Change location')).not.toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Additional plant actions'));
    expect(screen.getByRole('button', { name: 'Permanently delete' })).toBeInTheDocument();
  });

  it.each([
    [404, 'Plant not found'],
    [500, 'Plant detail could not be loaded'],
  ])('communicates detail error %s without displaying other plant data', async (status, heading) => {
    serveApi(apiState(), { plantGet: () => HttpResponse.json({ nickname: 'Wrong plant' }, { status }) });
    renderPlantsApp('/plants/999');

    expect(await screen.findByRole('heading', { name: heading })).toBeInTheDocument();
    expect(screen.queryByText('Wrong plant')).not.toBeInTheDocument();
    if (status === 500) expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });
});

describe('UC-018: Record Observation', () => {
  it('records an observation with optional notes and shows unobtrusive confirmation', async () => {
    const state = apiState({ plants: [plantFixture()] });
    serveApi(state);
    renderPlantsApp('/plants/1');
    await screen.findByRole('heading', { name: 'Record observation' });
    fireEvent.change(screen.getByLabelText('Observed at'), { target: { value: '2026-08-12T09:30' } });
    fireEvent.change(screen.getByLabelText(/Notes.*optional/), { target: { value: 'A new leaf is unfurling.' } });

    fireEvent.click(screen.getByRole('button', { name: 'Record observation' }));

    expect(await screen.findByRole('status')).toHaveTextContent('Observation recorded.');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(state.observations).toEqual([
      expect.objectContaining({
        plantId: 1,
        type: 'observation',
        timestamp: '2026-08-12T07:30:00.000Z',
        notes: 'A new leaf is unfurling.',
      }),
    ]);
  });

  it('allows an observation without notes', async () => {
    const state = apiState({ plants: [plantFixture()] });
    serveApi(state);
    renderPlantsApp('/plants/1');
    await screen.findByLabelText('Observed at');
    fireEvent.change(screen.getByLabelText('Observed at'), { target: { value: '2026-08-12T09:30' } });

    fireEvent.click(screen.getByRole('button', { name: 'Record observation' }));

    expect(await screen.findByRole('status')).toBeInTheDocument();
    expect(state.observations).toHaveLength(1);
    expect(state.observations[0].notes).toBeNull();
  });

  it.each(['dead', 'archived'] as PlantItem['status'][])(
    'does not offer observation recording for a %s plant',
    async (status) => {
      serveApi(apiState({ plants: [plantFixture({ status })] }));
      renderPlantsApp('/plants/1');

      await screen.findByRole('heading', { name: 'Restore plant' });
      expect(screen.queryByRole('heading', { name: 'Record observation' })).not.toBeInTheDocument();
    },
  );

  it.each([
    [400, 'Choose the current time or an earlier valid time'],
    [404, 'This plant could not be found'],
    [409, 'Observations can only be recorded for active plants'],
  ])('identifies API error %s and preserves entered observation data', async (status, message) => {
    const state = apiState({ plants: [plantFixture()] });
    serveApi(state, { observation: () => new HttpResponse(null, { status }) });
    renderPlantsApp('/plants/1');
    await screen.findByLabelText('Observed at');
    fireEvent.change(screen.getByLabelText('Observed at'), { target: { value: '2026-08-12T09:30' } });
    fireEvent.change(screen.getByLabelText(/Notes.*optional/), { target: { value: 'Keep this note' } });

    fireEvent.click(screen.getByRole('button', { name: 'Record observation' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(message);
    expect(screen.getByLabelText('Observed at')).toHaveValue('2026-08-12T09:30');
    expect(screen.getByLabelText(/Notes.*optional/)).toHaveValue('Keep this note');
    expect(state.observations).toEqual([]);
  });

  it('reports a recording failure, preserves input, and creates only one event after retry', async () => {
    const state = apiState({ plants: [plantFixture()] });
    let attempts = 0;
    serveApi(state, {
      observation: async ({ params, request }) => {
        attempts += 1;
        if (attempts === 1) return new HttpResponse(null, { status: 500 });
        const body = (await request.json()) as { timestamp: string; notes: string };
        const event = { id: 1, plantId: Number(params.id), type: 'observation' as const, timestamp: body.timestamp, notes: body.notes || null };
        state.observations.push(event);
        return HttpResponse.json(event, { status: 201 });
      },
    });
    renderPlantsApp('/plants/1');
    await screen.findByLabelText('Observed at');
    fireEvent.change(screen.getByLabelText('Observed at'), { target: { value: '2026-08-12T09:30' } });
    fireEvent.change(screen.getByLabelText(/Notes.*optional/), { target: { value: 'Retry this' } });

    fireEvent.click(screen.getByRole('button', { name: 'Record observation' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Nothing was partially saved');
    expect(screen.getByLabelText(/Notes.*optional/)).toHaveValue('Retry this');
    fireEvent.click(screen.getByRole('button', { name: 'Record observation' }));

    expect(await screen.findByRole('status')).toHaveTextContent('Observation recorded.');
    expect(attempts).toBe(2);
    expect(state.observations).toHaveLength(1);
  });
});

describe('UC-006: Remove Plant from Collection', () => {
  it('confirms dead and archive actions by plant name and cancels without mutation', async () => {
    const state = apiState({ plants: [plantFixture()] });
    let mutations = 0;
    serveApi(state, { status: () => { mutations += 1; return HttpResponse.json(state.plants[0]); } });
    renderPlantsApp('/plants/1');
    await screen.findByRole('heading', { name: 'Test Hoya' });

    fireEvent.click(screen.getByRole('button', { name: 'Mark dead' }));
    expect(screen.getByRole('dialog', { name: 'Mark dead Test Hoya?' })).toHaveTextContent('preserved');
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Archive plant' }));
    expect(screen.getByRole('dialog', { name: 'Archive Test Hoya?' })).toBeInTheDocument();
    expect(mutations).toBe(0);
  });

  it('marks a plant dead, restores it, and does not offer direct inactive transitions', async () => {
    const state = apiState({ plants: [plantFixture()] });
    serveApi(state);
    renderPlantsApp('/plants/1');
    await screen.findByRole('heading', { name: 'Test Hoya' });
    fireEvent.click(screen.getByRole('button', { name: 'Mark dead' }));
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Confirm mark dead' }));

    expect(await screen.findByRole('button', { name: 'Restore to active' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Archive plant' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Restore to active' }));
    expect(await screen.findByRole('button', { name: 'Mark dead' })).toBeInTheDocument();
    expect(state.plants[0].status).toBe('active');
  });

  it('confirms permanent deletion from the additional menu and returns to the collection', async () => {
    const state = apiState({ plants: [plantFixture({ status: 'archived' })] });
    serveApi(state);
    renderPlantsApp('/plants/1');
    await screen.findByRole('heading', { name: 'Test Hoya' });
    fireEvent.click(screen.getByLabelText('Additional plant actions'));
    fireEvent.click(screen.getByRole('button', { name: 'Permanently delete' }));
    expect(screen.getByRole('dialog', { name: 'Permanently delete Test Hoya?' })).toHaveTextContent('care events and images');
    fireEvent.click(screen.getByRole('button', { name: 'Confirm permanently delete' }));

    expect(await screen.findByRole('heading', { name: 'Your collection is empty' })).toBeInTheDocument();
    expect(state.plants).toEqual([]);
  });
});

describe('UC-012: Assign Plant to Location', () => {
  it('keeps No location available when no locations exist', async () => {
    const state = apiState({ plants: [plantFixture()], locations: [] });
    serveApi(state);
    renderPlantsApp('/plants/1');
    fireEvent.click(await screen.findByText('Change location'));

    expect(screen.getAllByRole('option')).toHaveLength(1);
    expect(screen.getByRole('option', { name: 'No location' })).toBeInTheDocument();
  });

  it('offers every location and No location, then displays replaced and cleared assignments', async () => {
    const balcony = locationFixture({ id: 1, name: 'Balcony' });
    const kitchen = locationFixture({ id: 2, name: 'Kitchen' });
    const state = apiState({ plants: [plantFixture()], locations: [balcony, kitchen] });
    serveApi(state);
    renderPlantsApp('/plants/1');
    fireEvent.click(await screen.findByText('Change location'));
    expect(screen.getByRole('option', { name: 'No location' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Balcony' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Kitchen' })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Location'), { target: { value: '2' } });
    fireEvent.click(screen.getByRole('button', { name: 'Apply location' }));
    expect(await screen.findByText('Kitchen')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Change location'));
    fireEvent.change(screen.getByLabelText('Location'), { target: { value: '' } });
    fireEvent.click(await screen.findByRole('button', { name: 'Apply location' }));
    expect(await screen.findByText('No location assigned')).toBeInTheDocument();
  });

  it('keeps the prior assignment and explains a stale location failure', async () => {
    const shelf = locationFixture({ name: 'Shelf' });
    const state = apiState({ plants: [plantFixture({ location: shelf })], locations: [shelf] });
    serveApi(state, { location: () => new HttpResponse(null, { status: 404 }) });
    renderPlantsApp('/plants/1');
    fireEvent.click(await screen.findByText('Change location'));
    fireEvent.change(screen.getByLabelText('Location'), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: 'Apply location' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('previous location was kept');
    expect(state.plants[0].location).toEqual(shelf);
  });
});

describe('UC-008: View Plant Collection', () => {
  it('defaults to active plants while selecting all species, locations, and No location', async () => {
    const archivedSpecies = speciesFixture({ id: 2, name: 'Archived Species', archived: true });
    const shelf = locationFixture({ name: 'Shelf' });
    const state = apiState({
      species: [speciesFixture(), archivedSpecies], locations: [shelf],
      plants: [plantFixture({ nickname: 'Active assigned', location: shelf }), plantFixture({ id: 2, nickname: 'Active unassigned' }), plantFixture({ id: 3, nickname: 'Dead plant', status: 'dead' }), plantFixture({ id: 4, nickname: 'Archived plant', status: 'archived', species: archivedSpecies })],
    });
    serveApi(state);
    renderPlantsApp('/plants');
    await screen.findByText('Active assigned');

    expect(screen.getByText('Active unassigned')).toBeInTheDocument();
    expect(screen.queryByText('Dead plant')).not.toBeInTheDocument();
    expect(screen.queryByText('Archived plant')).not.toBeInTheDocument();
    for (const checked of ['Active', 'Test Species', 'Archived Species (archived)', 'No location', 'Shelf']) expect(screen.getByRole('checkbox', { name: checked })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Dead' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Archived' })).not.toBeChecked();
  });

  it.each([
    ['nickname', 'Nickname', ['Alpha', 'Middle', 'Zebra']],
    ['species', 'Species name', ['Zebra', 'Alpha', 'Middle']],
    ['location', 'Location name', ['Alpha', 'Middle', 'Zebra']],
  ])('sorts displayed plants by %s in both directions', async (_field, option, ascending) => {
    const alpha = speciesFixture({ id: 1, name: 'Alpha species' });
    const beta = speciesFixture({ id: 2, name: 'Beta species' });
    const gamma = speciesFixture({ id: 3, name: 'Gamma species' });
    const a = locationFixture({ id: 1, name: 'A room' });
    const z = locationFixture({ id: 2, name: 'Z room' });
    const state = apiState({ species: [alpha, beta, gamma], locations: [a, z], plants: [plantFixture({ nickname: 'Zebra', species: alpha, location: z }), plantFixture({ id: 2, nickname: 'Alpha', species: beta, location: a }), plantFixture({ id: 3, nickname: 'Middle', species: gamma, location: null })] });
    serveApi(state);
    renderPlantsApp('/plants');
    await screen.findByText('Zebra');
    fireEvent.change(screen.getByLabelText('Sort by'), { target: { value: _field } });
    expect(collectionNames()).toEqual(ascending);
    fireEvent.change(screen.getByLabelText('Direction'), { target: { value: 'desc' } });
    expect(collectionNames()).toEqual([...ascending].reverse());
  });

  it('combines status, species, location, and case-insensitive search while excluding location-only matches', async () => {
    const fern = speciesFixture({ id: 2, name: 'Silver Fern' });
    const kitchen = locationFixture({ name: 'Kitchen Match' });
    const state = apiState({ species: [speciesFixture(), fern], locations: [kitchen], plants: [plantFixture({ nickname: 'Hoya One', location: kitchen }), plantFixture({ id: 2, nickname: 'Second', species: fern, location: null }), plantFixture({ id: 3, nickname: 'Dead Silver', species: fern, status: 'dead', location: kitchen })] });
    serveApi(state);
    renderPlantsApp('/plants');
    await screen.findByText('Hoya One');
    fireEvent.change(screen.getByLabelText('Search nickname or species'), { target: { value: 'kItChEn' } });
    expect(screen.getByRole('heading', { name: 'No plants match these filters' })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Search nickname or species'), { target: { value: 'sIlVeR' } });
    expect(screen.getByText('Second')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('checkbox', { name: 'Active' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Dead' }));
    expect(screen.getByText('Dead Silver')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('checkbox', { name: 'Silver Fern' }));
    expect(screen.getByRole('heading', { name: 'No plants match these filters' })).toBeInTheDocument();
  });

  it('shows the filtered empty state when neither a location nor No location is selected', async () => {
    const shelf = locationFixture({ name: 'Shelf' });
    const state = apiState({
      locations: [shelf],
      plants: [
        plantFixture({ nickname: 'Assigned', location: shelf }),
        plantFixture({ id: 2, nickname: 'Unassigned' }),
      ],
    });
    serveApi(state);
    renderPlantsApp('/plants');
    await screen.findByText('Assigned');

    fireEvent.click(screen.getByRole('checkbox', { name: 'Shelf' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'No location' }));

    expect(screen.getByRole('heading', { name: 'No plants match these filters' })).toBeInTheDocument();
    expect(screen.queryByText('Assigned')).not.toBeInTheDocument();
    expect(screen.queryByText('Unassigned')).not.toBeInTheDocument();
  });

  it('distinguishes collection and filtered empty states and links to add and detail', async () => {
    const empty = apiState();
    serveApi(empty);
    renderPlantsApp('/plants');
    expect(await screen.findByRole('heading', { name: 'Your collection is empty' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Add first plant' })).toHaveAttribute('href', '/plants/new');
  });

  it('communicates an unavailable collection, permits retry, and performs only reads', async () => {
    const state = apiState({ plants: [plantFixture()] });
    let attempts = 0;
    const methods: string[] = [];
    serveApi(state, { plantList: ({ request }) => { attempts += 1; methods.push(request.method); return attempts === 1 ? new HttpResponse(null, { status: 500 }) : HttpResponse.json(state.plants); } });
    renderPlantsApp('/plants');
    expect(await screen.findByRole('heading', { name: 'Collection could not be loaded' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByText('Test Hoya')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Search nickname or species'), { target: { value: 'hoya' } });
    expect(methods).toEqual(['GET', 'GET']);
  });
});

describe('UC-013: View Plants by Location', () => {
  it('groups each active plant exactly once with No location first and excludes inactive plants', async () => {
    const shelf = locationFixture({ name: 'Shelf' });
    const state = apiState({ locations: [shelf], plants: [plantFixture({ nickname: 'Unassigned' }), plantFixture({ id: 2, nickname: 'Assigned', location: shelf }), plantFixture({ id: 3, nickname: 'Dead hidden', status: 'dead', location: shelf }), plantFixture({ id: 4, nickname: 'Archived hidden', status: 'archived' })] });
    serveApi(state);
    renderPlantsApp('/plants/by-location');
    await screen.findByText('Assigned');

    expect(screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)).toEqual(['No location', 'Shelf']);
    expect(screen.getAllByText('Unassigned')).toHaveLength(1);
    expect(screen.getAllByText('Assigned')).toHaveLength(1);
    expect(screen.queryByText('Dead hidden')).not.toBeInTheDocument();
    expect(screen.queryByText('Archived hidden')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Assigned/ })).toHaveAttribute('href', '/plants/2');
  });

  it('keeps an empty No location group first when all active plants are assigned', async () => {
    const shelf = locationFixture({ name: 'Shelf' });
    serveApi(apiState({ locations: [shelf], plants: [plantFixture({ location: shelf })] }));
    renderPlantsApp('/plants/by-location');
    expect(await screen.findByText('No active plants are unassigned.')).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 2 })[0]).toHaveTextContent('No location');
  });

  it('shows an add action when no active plants exist and reports unavailable overview', async () => {
    const state = apiState({ plants: [plantFixture({ status: 'dead' })] });
    serveApi(state);
    renderPlantsApp('/plants/by-location');
    expect(await screen.findByRole('heading', { name: 'No active plants' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Add plant' })).toHaveAttribute('href', '/plants/new');
    cleanup();
    server.resetHandlers();
    serveApi(apiState(), { plantList: () => new HttpResponse(null, { status: 500 }) });
    renderPlantsApp('/plants/by-location');
    expect(await screen.findByRole('heading', { name: 'Plants could not be loaded' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });
});

interface ObservationFixture { id: number; plantId: number; type: 'observation'; timestamp: string; notes: string | null }
interface ApiState { plants: PlantItem[]; species: SpeciesOption[]; locations: LocationOption[]; observations: ObservationFixture[] }
interface ApiHandlers {
  create?: Parameters<typeof http.post>[1]; update?: Parameters<typeof http.patch>[1]; status?: Parameters<typeof http.patch>[1];
  location?: Parameters<typeof http.patch>[1]; plantGet?: Parameters<typeof http.get>[1]; plantList?: Parameters<typeof http.get>[1];
  observation?: Parameters<typeof http.post>[1];
}

function renderPlantsApp(entry: string) {
  const router = createMemoryRouter([
    { path: '/plants', element: <PlantCollectionRoute />, loader: plantCollectionLoader, errorElement: <PlantsError /> },
    { path: '/plants/by-location', element: <PlantsByLocationRoute />, loader: plantCollectionLoader, errorElement: <PlantsError area="locations" /> },
    { path: '/plants/new', element: <PlantFormRoute />, loader: plantFormLoader, action: plantFormAction, errorElement: <PlantsError area="form" /> },
    { path: '/plants/:plantId', element: <PlantDetailRoute />, loader: plantDetailLoader, action: plantDetailAction, errorElement: <PlantsError area="detail" /> },
    { path: '/plants/:plantId/edit', element: <PlantFormRoute />, loader: plantFormLoader, action: plantFormAction, errorElement: <PlantsError area="form" /> },
    { path: '/species/:speciesId', element: <Destination label="Species" /> },
  ], { initialEntries: [entry] });
  render(<RouterProvider router={router} />);
  return router;
}

function Destination({ label }: { label: string }) { const params = useParams(); return <h1>{label} {params.speciesId}</h1>; }

function serveApi(state: ApiState, handlers: ApiHandlers = {}) {
  server.use(
    http.get(`${apiOrigin}/api/plants`, handlers.plantList ?? (() => HttpResponse.json(state.plants))),
    http.get(`${apiOrigin}/api/plants/:id`, handlers.plantGet ?? (({ params }) => { const plant = state.plants.find((item) => item.id === Number(params.id)); return plant ? HttpResponse.json(plant) : new HttpResponse(null, { status: 404 }); })),
    http.get(`${apiOrigin}/api/species`, () => HttpResponse.json(state.species)),
    http.get(`${apiOrigin}/api/locations`, () => HttpResponse.json(state.locations)),
    http.post(`${apiOrigin}/api/plants`, handlers.create ?? (async ({ request }) => { const body = (await request.json()) as { nickname: string; speciesId: number; acquisitionDate: string; notes: string }; const created = plantFixture({ id: 1, nickname: body.nickname, acquisitionDate: body.acquisitionDate, notes: body.notes || null, species: state.species.find((item) => item.id === body.speciesId)! }); state.plants.push(created); return HttpResponse.json(created, { status: 201 }); })),
    http.patch(`${apiOrigin}/api/plants/:id`, handlers.update ?? (async ({ params, request }) => { const plant = state.plants.find((item) => item.id === Number(params.id))!; const body = (await request.json()) as { nickname: string; speciesId: number; acquisitionDate: string; notes: string }; Object.assign(plant, { nickname: body.nickname, acquisitionDate: body.acquisitionDate, notes: body.notes || null, species: state.species.find((item) => item.id === body.speciesId)! }); return HttpResponse.json(plant); })),
    http.patch(`${apiOrigin}/api/plants/:id/status`, handlers.status ?? (async ({ params, request }) => { const plant = state.plants.find((item) => item.id === Number(params.id))!; const body = (await request.json()) as { status: PlantItem['status'] }; plant.status = body.status; return HttpResponse.json(plant); })),
    http.patch(`${apiOrigin}/api/plants/:id/location`, handlers.location ?? (async ({ params, request }) => { const plant = state.plants.find((item) => item.id === Number(params.id))!; const body = (await request.json()) as { locationId: number | null }; plant.location = state.locations.find((item) => item.id === body.locationId) ?? null; return HttpResponse.json(plant); })),
    http.post(`${apiOrigin}/api/plants/:id/care-events`, handlers.observation ?? (async ({ params, request }) => { const body = (await request.json()) as { timestamp: string; notes: string }; const event: ObservationFixture = { id: state.observations.length + 1, plantId: Number(params.id), type: 'observation', timestamp: body.timestamp, notes: body.notes || null }; state.observations.push(event); return HttpResponse.json(event, { status: 201 }); })),
    http.delete(`${apiOrigin}/api/plants/:id`, ({ params }) => { const index = state.plants.findIndex((item) => item.id === Number(params.id)); if (index < 0) return new HttpResponse(null, { status: 404 }); state.plants.splice(index, 1); return new HttpResponse(null, { status: 204 }); }),
  );
}

function apiState(overrides: Partial<ApiState> = {}): ApiState { return { plants: [], species: [speciesFixture()], locations: [], observations: [], ...overrides }; }
function speciesFixture(overrides: Partial<SpeciesOption> = {}): SpeciesOption { return { id: 1, name: 'Test Species', archived: false, ...overrides }; }
function locationFixture(overrides: Partial<LocationOption> = {}): LocationOption { return { id: 1, name: 'Test location', ...overrides }; }
function plantFixture(overrides: Partial<PlantItem> = {}): PlantItem { return { id: 1, nickname: 'Test Hoya', acquisitionDate: '2024-04-05', notes: null, status: 'active', species: speciesFixture(), location: null, ...overrides }; }
function collectionNames(): string[] { return screen.getAllByRole('listitem').map((item) => within(item).getByRole('heading').textContent ?? ''); }
