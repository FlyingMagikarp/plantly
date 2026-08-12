import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';

const destinations = [
  { label: 'Home', to: '/', match: (path: string) => path === '/' },
  { label: 'My Plants', to: '/plants', match: (path: string) => path.startsWith('/plants') },
  { label: 'Species', to: '/species', match: (path: string) => path.startsWith('/species') },
  { label: 'Locations', to: '/locations', match: (path: string) => path.startsWith('/locations') },
];

export function AppShell() {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const restoreMenuFocus = useRef(false);

  useEffect(() => {
    if (!open) {
      if (!restoreMenuFocus.current) return;
      restoreMenuFocus.current = false;
      const frame = requestAnimationFrame(() => menuButton.current?.focus());
      return () => cancelAnimationFrame(frame);
    }
    closeButton.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        restoreMenuFocus.current = true;
        setOpen(false);
      }
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [open]);

  const closeDrawer = () => {
    restoreMenuFocus.current = true;
    setOpen(false);
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <aside className="hidden min-h-screen border-r border-neutral-200 bg-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:px-5 lg:py-6">
        <Brand />
        <Navigation className="mt-8" />
        <p className="mt-auto px-3 text-xs leading-5 text-neutral-500">Care first, logging second.</p>
      </aside>

      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-neutral-200 bg-white/95 px-4 backdrop-blur lg:hidden" inert={open ? true : undefined}>
        <Brand compact />
        <button
          aria-controls="mobile-navigation"
          aria-expanded={open}
          className="btn-secondary"
          onClick={() => setOpen(true)}
          ref={menuButton}
          type="button"
        >
          <MenuIcon /> Menu
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button aria-label="Close navigation" className="absolute inset-0 bg-neutral-950/40" onClick={closeDrawer} type="button" />
          <aside aria-label="Mobile navigation" className="relative flex h-full w-[min(20rem,86vw)] flex-col border-r border-neutral-200 bg-white p-5 shadow-xl" id="mobile-navigation">
            <div className="flex items-start justify-between gap-4">
              <Brand onNavigate={() => setOpen(false)} />
              <button aria-label="Close navigation" className="icon-button" onClick={closeDrawer} ref={closeButton} type="button">×</button>
            </div>
            <Navigation className="mt-8" onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <main className="min-w-0" id="main-content" inert={open ? true : undefined} tabIndex={-1}><Outlet /></main>
    </div>
  );
}

function Brand({ compact = false, onNavigate }: { compact?: boolean; onNavigate?: () => void }) {
  return (
    <Link className="group inline-flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-700" onClick={onNavigate} to="/">
      <span aria-hidden="true" className="grid size-9 place-items-center rounded-xl bg-green-700 text-lg font-bold text-white">P</span>
      <span>
        <span className="block text-lg font-bold leading-5 tracking-tight text-neutral-900">Plantly</span>
        {!compact && <span className="mt-1 block text-xs text-neutral-500">Personal plant care</span>}
      </span>
    </Link>
  );
}

function Navigation({ className = '', onNavigate }: { className?: string; onNavigate?: () => void }) {
  const path = useLocation().pathname;
  return (
    <nav aria-label="Primary navigation" className={className}>
      <ul className="grid gap-1">
        {destinations.map((destination) => {
          const current = destination.match(path);
          return (
            <li key={destination.to}>
              <NavLink
                aria-current={current ? 'page' : undefined}
                className={`nav-link ${current ? 'nav-link-current' : ''}`}
                end={destination.to === '/'}
                onClick={onNavigate}
                to={destination.to}
              >
                <span aria-hidden="true" className={`h-5 w-1 rounded-full ${current ? 'bg-green-700' : 'bg-transparent'}`} />
                {destination.label}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function MenuIcon() {
  return <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /></svg>;
}
