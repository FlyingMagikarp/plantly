import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { CareRoundRoute } from './care-round';
import { careRoundAction, careRoundLoader, type CareRound, type CareRoundOption } from './care-round-data';

const server = setupServer(); const origin = 'http://localhost';
beforeAll(() => { server.listen({ onUnhandledRequest: 'error' }); const fetch = globalThis.fetch; vi.stubGlobal('fetch', (input: RequestInfo | URL, init?: RequestInit) => fetch(typeof input === 'string' ? new URL(input, origin) : input, init)); });
afterEach(() => { cleanup(); server.resetHandlers(); }); afterAll(() => { vi.unstubAllGlobals(); server.close(); });

describe('UC-030 through UC-032: Plant Care Rounds', () => {
  it('shows ordered location choices and starts at the first snapshot plant without recording care', async () => {
    const state = apiState({ options: [{ locationId: 1, name: 'Shelf', plantCount: 2 }, { locationId: null, name: 'No location', plantCount: 1 }] }); serve(state); renderRoute();
    const select = await screen.findByLabelText('Location'); expect(Array.from((select as HTMLSelectElement).options).map((option) => option.text)).toEqual(['Shelf (2)', 'No location (1)']); fireEvent.click(screen.getByRole('button', { name: 'Start round' }));
    expect(await screen.findByRole('heading', { name: 'First plant' })).toBeInTheDocument(); expect(state.events).toEqual([]); expect(screen.getByText('Plant 1 of 2')).toBeInTheDocument();
  });

  it('records repeated care for the current plant with optional watering detail and never advances automatically', async () => {
    const state = apiState({ active: round() }); serve(state); renderRoute();
    await screen.findByRole('heading', { name: 'First plant' }); fireEvent.click(screen.getByLabelText('Fertilizer included')); fireEvent.click(screen.getByRole('button', { name: 'Record care' }));
    expect(await screen.findByRole('status')).toHaveTextContent('This plant remains current'); expect(screen.getByRole('heading', { name: 'First plant' })).toBeInTheDocument(); expect(state.events).toHaveLength(1); expect(state.events[0]).toMatchObject({ plantId: 1, type: 'watering', fertilizerIncluded: true });
    fireEvent.change(screen.getByLabelText('Care type'), { target: { value: 'observation' } }); fireEvent.click(screen.getByRole('button', { name: 'Record care' })); expect(await screen.findByRole('status')).toHaveTextContent('Care recorded'); expect(state.events).toHaveLength(2);
  });

  it('skips and returns without events while preserving snapshot order and flags an unavailable member', async () => {
    const state = apiState({ active: round() }); serve(state); const router = renderRoute(); await screen.findByText('First plant'); fireEvent.click(screen.getByRole('button', { name: 'Skip / next plant' }));
    expect(await screen.findByRole('heading', { name: 'Second plant' })).toBeInTheDocument(); expect(state.events).toEqual([]); fireEvent.click(screen.getByRole('button', { name: 'Previous plant' })); expect(await screen.findByRole('heading', { name: 'First plant' })).toBeInTheDocument();
    state.active!.members[0].available = false; router.revalidate(); expect(await screen.findByText(/no longer active or available/i)).toBeInTheDocument(); expect(screen.queryByRole('button', { name: 'Record care' })).not.toBeInTheDocument();
  });

  it('cancels completion unchanged, then completes early with only cared plants and continues Home', async () => {
    const active = round(); active.summary = [active.members[0]]; const state = apiState({ active }); serve(state); const router = renderRoute(); await screen.findByText('First plant'); fireEvent.click(screen.getByRole('button', { name: 'Complete round' })); const dialog = screen.getByRole('dialog'); expect(dialog).toHaveTextContent('Remaining plants will receive no invented events'); fireEvent.click(within(dialog).getByRole('button', { name: 'Cancel' })); expect(state.active?.status).toBe('active');
    fireEvent.click(screen.getByRole('button', { name: 'Complete round' })); fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Complete round' })); expect(await screen.findByRole('heading', { name: 'Care summary' })).toBeInTheDocument(); expect(screen.getByText('First plant')).toBeInTheDocument(); expect(screen.queryByText('Second plant')).not.toBeInTheDocument(); expect(screen.getByRole('link', { name: 'Continue to Home' })).toHaveAttribute('href', '/');
    await router.navigate('/care-round'); expect(state.active).toBeNull();
  });

  it('shows a recoverable failure and keeps the same current plant', async () => {
    const state = apiState({ active: round(), failRecord: true }); serve(state); renderRoute(); await screen.findByText('First plant'); fireEvent.click(screen.getByRole('button', { name: 'Record care' })); expect(await screen.findByRole('alert')).toHaveTextContent('could not be changed'); expect(screen.getByRole('heading', { name: 'First plant' })).toBeInTheDocument(); expect(state.events).toEqual([]);
  });
});

interface State { options: CareRoundOption[]; active: CareRound | null; events: Array<Record<string, unknown>>; failRecord: boolean }
function apiState(overrides: Partial<State> = {}): State { return { options: [], active: null, events: [], failRecord: false, ...overrides }; }
function renderRoute() { const router = createMemoryRouter([{ path: '/care-round', element: <CareRoundRoute />, loader: careRoundLoader, action: careRoundAction }, { path: '/', element: <h1>Home</h1> }], { initialEntries: ['/care-round'] }); render(<RouterProvider router={router} />); return router; }
function serve(state: State) { server.use(http.get(`${origin}/api/care-rounds/options`, () => HttpResponse.json(state.options)), http.get(`${origin}/api/care-rounds/active`, () => HttpResponse.json(state.active)), http.post(`${origin}/api/care-rounds`, async ({ request }) => { const body = await request.json() as { locationId: number | null }; state.active = round({ locationId: body.locationId, locationName: body.locationId === null ? 'No location' : 'Shelf' }); return HttpResponse.json(state.active, { status: 201 }); }), http.patch(`${origin}/api/care-rounds/:roundId/progress`, async ({ request }) => { const body = await request.json() as { direction: 'next' | 'previous' }; if (!state.active) return HttpResponse.json({}, { status: 404 }); state.active.currentIndex += body.direction === 'next' ? 1 : -1; return HttpResponse.json(state.active); }), http.post(`${origin}/api/care-rounds/:roundId/plants/:plantId/care-events`, async ({ params, request }) => { if (state.failRecord) return HttpResponse.json({}, { status: 500 }); const body = await request.json() as Record<string, unknown>; state.events.push({ ...body, plantId: Number(params.plantId) }); return HttpResponse.json({ id: state.events.length }, { status: 201 }); }), http.patch(`${origin}/api/care-rounds/:roundId/complete`, () => { if (!state.active) return HttpResponse.json({}, { status: 404 }); state.active = { ...state.active, status: 'completed' }; const completed = state.active; state.active = null; return HttpResponse.json(completed); })); }
function round(overrides: Partial<CareRound> = {}): CareRound { return { id: 1, status: 'active', locationId: 1, locationName: 'Shelf', currentIndex: 0, members: [{ position: 0, plantId: 1, nickname: 'First plant', speciesName: 'Hoya', available: true }, { position: 1, plantId: 2, nickname: 'Second plant', speciesName: 'Fern', available: true }], summary: [], ...overrides }; }
