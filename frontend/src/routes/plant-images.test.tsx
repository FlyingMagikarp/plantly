import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { File as NodeFile } from 'node:buffer';
import { PlantImagesRoute } from './plant-images';
import { plantImagesAction, plantImagesLoader, type PlantImageItem } from './plant-images-data';
import type { PlantItem } from './plants-data';

const server = setupServer(); const origin = 'http://localhost';
beforeAll(() => { server.listen({ onUnhandledRequest: 'error' }); const fetch = globalThis.fetch; vi.stubGlobal('fetch', (input: RequestInfo | URL, init?: RequestInit) => fetch(typeof input === 'string' ? new URL(input, origin) : input, init)); });
afterEach(() => { cleanup(); server.resetHandlers(); }); afterAll(() => { vi.unstubAllGlobals(); server.close(); });

describe('UC-022, UC-024 and UC-025: Plant Images', () => {
  it('shows newest images, opens detail content, and communicates an unavailable image independently', async () => {
    const images = [image({ id: 2, addedAt: '2026-08-20T08:00:00Z' }), image({ id: 1, addedAt: '2026-08-19T08:00:00Z' })]; serve(plant(), images); renderRoute();
    const previews = await screen.findAllByRole('img', { name: 'Plant attachment' });
    expect(previews.map((item) => item.getAttribute('src'))).toEqual(['/api/plants/1/images/2/content', '/api/plants/1/images/1/content']);
    expect(previews[0].closest('a')).toHaveAttribute('target', '_blank'); fireEvent.error(previews[0]);
    expect(screen.getByText('Image unavailable')).toBeInTheDocument(); expect(screen.getAllByRole('img')).toHaveLength(1);
  });

  it('displays an empty state and submits a valid image without metadata', async () => {
    const images: PlantImageItem[] = []; serve(plant(), images); renderRoute();
    expect(await screen.findByRole('heading', { name: 'No images yet' })).toBeInTheDocument();
    const input = screen.getByLabelText(/Add JPEG or PNG/); expect(input).toHaveAttribute('accept', 'image/jpeg,image/png'); expect(input).toBeRequired();
    const result = await submitImage(new NodeFile([new Uint8Array([137, 80, 78, 71])], 'plant.png', { type: 'image/png' }));
    expect(result).toEqual({ ok: true, intent: 'add-image', message: 'Image added.' }); expect(images).toHaveLength(1);
  });

  it('identifies invalid upload and keeps the existing collection available for retry', async () => {
    const images = [image()]; serve(plant(), images, { rejectAdd: true }); renderRoute(); await screen.findByRole('img');
    const result = await submitImage(new NodeFile(['text'], 'plant.txt', { type: 'text/plain' }));
    expect(result).toEqual({ ok: false, intent: 'add-image', message: 'Select a JPEG or PNG image no larger than 10 MB.' }); expect(images).toHaveLength(1);
  });

  it('requires confirmation, cancels unchanged, removes only the selected image, and hides mutations for inactive plants', async () => {
    const images = [image({ id: 1 }), image({ id: 2 })]; serve(plant(), images); const router = renderRoute();
    const remove = await screen.findAllByRole('button', { name: 'Remove' }); fireEvent.click(remove[0]); const dialog = screen.getByRole('dialog'); expect(dialog).toHaveTextContent('cannot be undone'); fireEvent.click(within(dialog).getByRole('button', { name: 'Cancel' })); expect(images).toHaveLength(2);
    fireEvent.click(screen.getAllByRole('button', { name: 'Remove' })[0]); fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Permanently remove' }));
    expect(await screen.findByRole('status')).toHaveTextContent('Image permanently removed.'); expect(images).toHaveLength(1);
    server.resetHandlers(); serve(plant({ status: 'archived' }), images); await router.navigate('/plants/1/images');
    expect(await screen.findByText('Images are shown newest first.')).toBeInTheDocument(); expect(screen.queryByRole('button', { name: 'Remove' })).not.toBeInTheDocument(); expect(screen.queryByRole('button', { name: 'Add image' })).not.toBeInTheDocument();
  });
});

function renderRoute() { const router = createMemoryRouter([{ path: '/plants/:plantId/images', element: <PlantImagesRoute />, loader: plantImagesLoader, action: plantImagesAction }], { initialEntries: ['/plants/1/images'] }); render(<RouterProvider router={router} />); return router; }
async function submitImage(file: NodeFile) { const data = new FormData(); data.set('intent', 'add-image'); data.set('image', file as unknown as File); return plantImagesAction({ request: new Request(`${origin}/plants/1/images`, { method: 'POST', body: data }), params: { plantId: '1' }, context: undefined } as never); }
function serve(currentPlant: PlantItem, images: PlantImageItem[], options: { rejectAdd?: boolean } = {}) { server.use(http.get(`${origin}/api/plants/1`, () => HttpResponse.json(currentPlant)), http.get(`${origin}/api/plants/1/images`, () => HttpResponse.json(images)), http.post(`${origin}/api/plants/1/images`, async () => { if (options.rejectAdd) return HttpResponse.json({}, { status: 400 }); const added = image({ id: 3 }); images.unshift(added); return HttpResponse.json(added, { status: 201 }); }), http.delete(`${origin}/api/plants/1/images/:imageId`, ({ params }) => { const index = images.findIndex((item) => item.id === Number(params.imageId)); if (index < 0) return HttpResponse.json({}, { status: 404 }); images.splice(index, 1); return HttpResponse.json({ removedImageId: Number(params.imageId) }); })); }
function plant(overrides: Partial<PlantItem> = {}): PlantItem { return { id: 1, nickname: 'Test Hoya', acquisitionDate: '2025-01-01', notes: null, status: 'active', species: { id: 1, name: 'Hoya', archived: false }, location: null, ...overrides }; }
function image(overrides: Partial<PlantImageItem> = {}): PlantImageItem { const id = overrides.id ?? 1; return { id, plantId: 1, mediaType: 'image/png', byteSize: 10, addedAt: '2026-08-20T08:00:00Z', contentUrl: `/api/plants/1/images/${id}/content`, ...overrides }; }
