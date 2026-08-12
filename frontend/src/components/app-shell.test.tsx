import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { RouterProvider, createMemoryRouter, useLocation } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';
import { AppShell } from './app-shell';

afterEach(cleanup);

describe('UC-033: Navigate Application', () => {
  it('offers only implemented destinations and identifies nested areas without relying on colour', () => {
    renderShell('/plants/7/edit');
    const desktopNavigation = screen.getAllByRole('navigation', { name: 'Primary navigation' })[0];

    expect(within(desktopNavigation).getAllByRole('link').map((link) => link.textContent?.trim())).toEqual(['Home', 'My Plants', 'Species', 'Locations']);
    expect(within(desktopNavigation).getByRole('link', { name: 'My Plants' })).toHaveAttribute('aria-current', 'page');
    expect(within(desktopNavigation).queryByRole('link', { name: /care/i })).not.toBeInTheDocument();
  });

  it('opens and dismisses mobile navigation by close control, backdrop, and Escape without changing page state', async () => {
    renderShell('/plants');
    const input = screen.getByLabelText('Draft note');
    fireEvent.change(input, { target: { value: 'Keep this draft' } });

    for (const dismiss of ['close', 'backdrop', 'escape']) {
      fireEvent.click(screen.getByRole('button', { name: 'Menu' }));
      expect(screen.getByRole('complementary', { name: 'Mobile navigation' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-expanded', 'true');
      if (dismiss === 'close') fireEvent.click(within(screen.getByRole('complementary', { name: 'Mobile navigation' })).getByRole('button', { name: 'Close navigation' }));
      if (dismiss === 'backdrop') fireEvent.click(screen.getAllByRole('button', { name: 'Close navigation' })[0]);
      if (dismiss === 'escape') fireEvent.keyDown(document, { key: 'Escape' });
      await waitFor(() => expect(screen.queryByRole('complementary', { name: 'Mobile navigation' })).not.toBeInTheDocument());
      expect(input).toHaveValue('Keep this draft');
      await waitFor(() => expect(screen.getByRole('button', { name: 'Menu' })).toHaveFocus());
    }
  });

  it('navigates from the drawer, closes it, and keeps the corresponding destination current', async () => {
    const router = renderShell('/plants');
    fireEvent.click(screen.getByRole('button', { name: 'Menu' }));
    const drawer = screen.getByRole('complementary', { name: 'Mobile navigation' });
    fireEvent.click(within(drawer).getByRole('link', { name: 'Species' }));

    await waitFor(() => expect(router.state.location.pathname).toBe('/species'));
    expect(screen.queryByRole('complementary', { name: 'Mobile navigation' })).not.toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Species' })[0]).toHaveAttribute('aria-current', 'page');
  });

  it('uses the Plantly identity to reach Home and provides contextual return links', async () => {
    const router = renderShell('/species/1');
    expect(screen.getByRole('link', { name: 'Species overview' })).toHaveAttribute('href', '/species');
    fireEvent.click(screen.getAllByRole('link', { name: /Plantly/ })[0]);
    await waitFor(() => expect(router.state.location.pathname).toBe('/'));

    await router.navigate('/plants/1');
    expect(await screen.findByRole('link', { name: 'My Plants overview' })).toHaveAttribute('href', '/plants');
  });
});

function renderShell(entry: string) {
  const router = createMemoryRouter([{
    element: <AppShell />,
    children: [
      { path: '/', element: <Screen title="Home" /> },
      { path: '/plants', element: <DraftScreen /> },
      { path: '/plants/:plantId', element: <Screen parent="My Plants" title="Plant detail" /> },
      { path: '/plants/:plantId/edit', element: <Screen parent="My Plants" title="Edit plant" /> },
      { path: '/species', element: <Screen title="Species" /> },
      { path: '/species/:speciesId', element: <Screen parent="Species" title="Species detail" /> },
      { path: '/locations', element: <Screen title="Locations" /> },
    ],
  }], { initialEntries: [entry] });
  render(<RouterProvider router={router} />);
  return router;
}

function DraftScreen() { return <><h1>My Plants</h1><label>Draft note<input aria-label="Draft note" /></label></>; }
function Screen({ parent, title }: { parent?: 'My Plants' | 'Species'; title: string }) {
  const location = useLocation();
  return <><h1>{title}</h1>{parent && <a href={parent === 'Species' ? '/species' : '/plants'}>{parent} overview</a>}<p>{location.pathname}</p></>;
}
