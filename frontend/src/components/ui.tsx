import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export function Page({ children, width = 'wide' }: { children: ReactNode; width?: 'wide' | 'reading' }) {
  return <div className="page"><div className={width === 'reading' ? 'page-reading' : 'page-wide'}>{children}</div></div>;
}

export function PageHeader({ action, eyebrow, title, description }: { action?: ReactNode; eyebrow?: string; title: ReactNode; description?: ReactNode }) {
  return <header className="page-header"><div><>{eyebrow && <p className="eyebrow">{eyebrow}</p>}</><h1 className="page-title">{title}</h1>{description && <p className="page-description">{description}</p>}</div>{action && <div className="page-action">{action}</div>}</header>;
}

export function BackLink({ children, to }: { children: ReactNode; to: string }) {
  return <Link className="back-link" to={to}>← {children}</Link>;
}

export function EmptyState({ action, description, title }: { action?: ReactNode; description: ReactNode; title: ReactNode }) {
  return <section className="empty-state"><div aria-hidden="true" className="mx-auto mb-4 grid size-10 place-items-center rounded-full bg-green-50 text-green-700">⌁</div><h2 className="text-lg font-semibold text-neutral-900">{title}</h2><p className="mt-2 text-sm text-neutral-600">{description}</p>{action && <div className="mt-5">{action}</div>}</section>;
}

export function ErrorState({ action, description, title }: { action: ReactNode; description: ReactNode; title: ReactNode }) {
  return <Page width="reading"><section className="card mx-auto mt-12 max-w-lg p-6 text-center sm:p-8"><div aria-hidden="true" className="mx-auto mb-4 grid size-10 place-items-center rounded-full bg-red-50 font-bold text-red-700">!</div><h1 className="text-2xl font-bold tracking-tight">{title}</h1><p className="mt-3 text-neutral-600">{description}</p><div className="mt-6">{action}</div></section></Page>;
}
