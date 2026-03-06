import { Link, NavLink, Outlet } from 'react-router-dom';
import { Landmark } from 'lucide-react';
import { useAuth } from '../auth';
import { Button } from './ui/button';

export function AppShell({
  links,
  title,
}: {
  links: { to: string; label: string }[];
  title: string;
}) {
  const { session, logout } = useAuth();

  return (
    <div className="min-h-screen bg-transparent">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-4 lg:px-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-slate-900 p-2 text-white">
              <Landmark className="h-4 w-4" />
            </div>
            <div>
              <Link to="/" className="text-lg font-bold tracking-tight text-slate-900">SecureBank</Link>
              <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">{title}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 sm:inline-flex">
              {session?.role === 'user'
                ? `${session.fullName}${session.accountNumber ? ` (${session.accountNumber})` : ''}`
                : session?.username}
            </span>
            <Button variant="outline" onClick={logout}>Logout</Button>
          </div>
        </div>
      </header>
      <div className="grid gap-5 px-2 py-6 md:grid-cols-[260px_1fr] lg:gap-6 lg:px-3">
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:sticky md:top-24 md:min-h-[calc(100vh-7.5rem)]">
          <nav className="flex flex-col gap-1.5">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                      : 'border-transparent text-slate-700 hover:border-slate-200 hover:bg-slate-100'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="space-y-5 px-4 lg:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
