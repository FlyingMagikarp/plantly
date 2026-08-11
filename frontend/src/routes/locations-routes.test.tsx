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
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import {
  type LocationItem,
  locationsAction,
  locationsLoader,
} from './locations-data';
import { LocationsError, LocationsRoute } from './locations';

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

describe('UC-009: Create Location', () => {
  it('creates a named location and displays its system identifier', async () => {
    const locations: LocationItem[] = [];
    serveLocationCollection(locations);
    renderLocationsApp();
    await screen.findByRole('heading', { name: 'No locations yet' });

    fireEvent.change(screen.getByLabelText('New location name'), {
      target: { value: 'Balcony' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Add location' }));

    expect(await screen.findByRole('heading', { name: 'Balcony' })).toBeInTheDocument();
    expect(screen.getByText('Location 1')).toBeInTheDocument();
    expect(locations).toEqual([{ id: 1, name: 'Balcony' }]);
  });

  it('identifies a duplicate name and preserves the entered value', async () => {
    const locations = [locationFixture({ name: 'Balcony' })];
    serveLocationCollection(locations, {
      create: () =>
        HttpResponse.json(
          { message: 'Location name is already used' },
          { status: 409 },
        ),
    });
    renderLocationsApp();
    await screen.findByRole('heading', { name: 'Balcony' });
    const input = screen.getByLabelText('New location name');

    fireEvent.change(input, { target: { value: 'BALCONY' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add location' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'That location name is already used.',
    );
    expect(input).toHaveValue('BALCONY');
    expect(locations).toHaveLength(1);
  });

  it('preserves a valid name after failure and succeeds when retried', async () => {
    const locations: LocationItem[] = [];
    let attempts = 0;
    serveLocationCollection(locations, {
      create: async ({ request }) => {
        attempts += 1;
        if (attempts === 1) {
          return new HttpResponse(null, { status: 500 });
        }
        const body = (await request.json()) as { name: string };
        const created = { id: 4, name: body.name };
        locations.push(created);
        return HttpResponse.json(created, { status: 201 });
      },
    });
    renderLocationsApp();
    await screen.findByRole('heading', { name: 'No locations yet' });
    const input = screen.getByLabelText('New location name');
    fireEvent.change(input, { target: { value: 'Sunroom' } });

    fireEvent.click(screen.getByRole('button', { name: 'Add location' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'The location could not be created.',
    );
    expect(input).toHaveValue('Sunroom');
    expect(locations).toEqual([]);

    fireEvent.click(screen.getByRole('button', { name: 'Add location' }));
    expect(await screen.findByRole('heading', { name: 'Sunroom' })).toBeInTheDocument();
    expect(attempts).toBe(2);
  });
});

describe('UC-010: Update Location', () => {
  it('shows the current name for editing and displays a successful rename with the same identifier', async () => {
    const locations = [locationFixture({ id: 7, name: 'Balcony' })];
    serveLocationCollection(locations);
    renderLocationsApp();
    const row = await locationRow('Balcony');

    fireEvent.click(within(row).getByText('Rename location'));
    const name = within(row).getByLabelText('Name');
    expect(name).toHaveValue('Balcony');
    fireEvent.change(name, { target: { value: 'Sunroom' } });
    fireEvent.click(within(row).getByRole('button', { name: 'Save name' }));

    expect(await screen.findByRole('heading', { name: 'Sunroom' })).toBeInTheDocument();
    expect(screen.getByText('Location 7')).toBeInTheDocument();
    expect(locations).toEqual([{ id: 7, name: 'Sunroom' }]);
  });

  it('identifies a conflicting rename, preserves the entry, and leaves both locations displayed', async () => {
    const locations = [
      locationFixture({ id: 1, name: 'Balcony' }),
      locationFixture({ id: 2, name: 'Kitchen' }),
    ];
    serveLocationCollection(locations, {
      update: () => new HttpResponse(null, { status: 409 }),
    });
    renderLocationsApp();
    const row = await locationRow('Balcony');
    fireEvent.click(within(row).getByText('Rename location'));
    const name = within(row).getByLabelText('Name');
    fireEvent.change(name, { target: { value: 'Kitchen   ' } });

    fireEvent.click(within(row).getByRole('button', { name: 'Save name' }));

    expect(await within(row).findByRole('alert')).toHaveTextContent(
      'That location name is already used.',
    );
    expect(name).toHaveValue('Kitchen   ');
    expect(screen.getByRole('heading', { name: 'Balcony' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Kitchen' })).toBeInTheDocument();
  });

  it('communicates a missing location without replacing another row', async () => {
    const locations = [locationFixture({ id: 1, name: 'Balcony' })];
    serveLocationCollection(locations, {
      update: () => new HttpResponse(null, { status: 404 }),
    });
    renderLocationsApp();
    const row = await locationRow('Balcony');
    fireEvent.click(within(row).getByText('Rename location'));
    fireEvent.change(within(row).getByLabelText('Name'), {
      target: { value: 'Office' },
    });

    fireEvent.click(within(row).getByRole('button', { name: 'Save name' }));

    expect(await within(row).findByRole('alert')).toHaveTextContent(
      'This location could not be found.',
    );
    expect(locations).toEqual([{ id: 1, name: 'Balcony' }]);
  });

  it('communicates a failed rename while preserving the entry and stored name', async () => {
    const locations = [locationFixture({ id: 1, name: 'Balcony' })];
    serveLocationCollection(locations, {
      update: () => new HttpResponse(null, { status: 500 }),
    });
    renderLocationsApp();
    const row = await locationRow('Balcony');
    fireEvent.click(within(row).getByText('Rename location'));
    const name = within(row).getByLabelText('Name');
    fireEvent.change(name, { target: { value: 'Office' } });

    fireEvent.click(within(row).getByRole('button', { name: 'Save name' }));

    expect(await within(row).findByRole('alert')).toHaveTextContent(
      'The location could not be renamed.',
    );
    expect(name).toHaveValue('Office');
    expect(locations).toEqual([{ id: 1, name: 'Balcony' }]);
  });
});

describe('UC-011: Remove Location', () => {
  it('identifies the location, explains unassignment, and cancels without deletion', async () => {
    const locations = [locationFixture({ name: 'Balcony' })];
    let deleteRequests = 0;
    serveLocationCollection(locations, {
      remove: () => {
        deleteRequests += 1;
        return new HttpResponse(null, { status: 204 });
      },
    });
    renderLocationsApp();
    await screen.findByRole('heading', { name: 'Balcony' });

    fireEvent.click(screen.getByRole('button', { name: 'Remove' }));
    const dialog = screen.getByRole('dialog', { name: 'Remove Balcony?' });
    expect(dialog).toHaveTextContent('Any plants assigned to it will become unassigned');
    expect(dialog).toHaveTextContent('plants and their history will remain unchanged');
    fireEvent.click(within(dialog).getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Balcony' })).toBeInTheDocument();
    expect(deleteRequests).toBe(0);
  });

  it('permanently removes a confirmed location and displays the remaining locations', async () => {
    const locations = [
      locationFixture({ id: 1, name: 'Balcony' }),
      locationFixture({ id: 2, name: 'Kitchen' }),
    ];
    serveLocationCollection(locations);
    renderLocationsApp();
    const balcony = await locationRow('Balcony');

    fireEvent.click(within(balcony).getByRole('button', { name: 'Remove' }));
    fireEvent.click(
      within(screen.getByRole('dialog')).getByRole('button', {
        name: 'Permanently remove',
      }),
    );

    await waitFor(() =>
      expect(screen.queryByRole('heading', { name: 'Balcony' })).not.toBeInTheDocument(),
    );
    expect(screen.getByRole('heading', { name: 'Kitchen' })).toBeInTheDocument();
    expect(locations).toEqual([{ id: 2, name: 'Kitchen' }]);
  });

  it('communicates that a confirmed location is no longer available', async () => {
    const locations = [locationFixture({ name: 'Balcony' })];
    serveLocationCollection(locations, {
      remove: () => new HttpResponse(null, { status: 404 }),
    });
    renderLocationsApp();
    await screen.findByRole('heading', { name: 'Balcony' });
    fireEvent.click(screen.getByRole('button', { name: 'Remove' }));

    fireEvent.click(
      within(screen.getByRole('dialog')).getByRole('button', {
        name: 'Permanently remove',
      }),
    );

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'This location could not be found.',
    );
    expect(locations).toHaveLength(1);
  });

  it('communicates failed removal and leaves the location displayed for retry', async () => {
    const locations = [locationFixture({ name: 'Balcony' })];
    serveLocationCollection(locations, {
      remove: () => new HttpResponse(null, { status: 500 }),
    });
    renderLocationsApp();
    await screen.findByRole('heading', { name: 'Balcony' });
    fireEvent.click(screen.getByRole('button', { name: 'Remove' }));

    fireEvent.click(
      within(screen.getByRole('dialog')).getByRole('button', {
        name: 'Permanently remove',
      }),
    );

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'The location could not be removed. Nothing was changed.',
    );
    expect(screen.getByRole('heading', { name: 'Remove Balcony?' })).toBeInTheDocument();
    expect(locations).toHaveLength(1);
  });
});

function renderLocationsApp() {
  const router = createMemoryRouter(
    [
      {
        path: '/locations',
        element: <LocationsRoute />,
        loader: locationsLoader,
        action: locationsAction,
        errorElement: <LocationsError />,
      },
    ],
    { initialEntries: ['/locations'] },
  );

  render(<RouterProvider router={router} />);
  return router;
}

interface LocationHandlers {
  create?: Parameters<typeof http.post>[1];
  update?: Parameters<typeof http.patch>[1];
  remove?: Parameters<typeof http.delete>[1];
}

function serveLocationCollection(
  locations: LocationItem[],
  handlers: LocationHandlers = {},
) {
  server.use(
    http.get(`${apiOrigin}/api/locations`, () => HttpResponse.json(locations)),
    http.post(
      `${apiOrigin}/api/locations`,
      handlers.create ??
        (async ({ request }) => {
          const body = (await request.json()) as { name: string };
          const created = {
            id: locations.reduce((maximum, item) => Math.max(maximum, item.id), 0) + 1,
            name: body.name,
          };
          locations.push(created);
          return HttpResponse.json(created, { status: 201 });
        }),
    ),
    http.patch(
      `${apiOrigin}/api/locations/:locationId`,
      handlers.update ??
        (async ({ params, request }) => {
          const body = (await request.json()) as { name: string };
          const location = locations.find(
            (item) => item.id === Number(params.locationId),
          );
          if (!location) {
            return new HttpResponse(null, { status: 404 });
          }
          location.name = body.name;
          return HttpResponse.json(location);
        }),
    ),
    http.delete(
      `${apiOrigin}/api/locations/:locationId`,
      handlers.remove ??
        (({ params }) => {
          const index = locations.findIndex(
            (item) => item.id === Number(params.locationId),
          );
          if (index < 0) {
            return new HttpResponse(null, { status: 404 });
          }
          locations.splice(index, 1);
          return new HttpResponse(null, { status: 204 });
        }),
    ),
  );
}

async function locationRow(name: string): Promise<HTMLElement> {
  const heading = await screen.findByRole('heading', { name });
  const row = heading.closest('article');
  if (!row) {
    throw new Error(`Location row ${name} was not found`);
  }
  return row;
}

function locationFixture(overrides: Partial<LocationItem> = {}): LocationItem {
  return { id: 1, name: 'Test location', ...overrides };
}
