import Link from "next/link";
import {
  BarChart3,
  BookOpen,
  Code2,
  ContactRound,
  FileText,
  Globe2,
  LayoutDashboard,
  PanelsTopLeft,
  Search,
  Settings,
} from "lucide-react";
import { PRODUCT } from "@/lib";
import type { ReactNode } from "react";
import { useSignOut } from "@/hooks";
const nav = [
  [LayoutDashboard, "Overview", "/dashboard"],
  [PanelsTopLeft, "Sites", "/dashboard/sites"],
  [ContactRound, "CRM", "/dashboard/crm"],
  [BookOpen, "CMS", "/dashboard/cms"],
  [FileText, "Forms", "/dashboard/forms"],
  [Globe2, "Domains", "/dashboard/domains"],
  [BarChart3, "Analytics", "/dashboard/analytics"],
  [Code2, "Developer", "/dashboard/developer"],
] as const;
export function AppShell({ children }: { children: ReactNode }) {
  const { signOut, signingOut } = useSignOut();
  return (
    <div className="min-h-screen bg-[#f7f7fa]">
      <aside className="fixed inset-y-0 w-60 border-r border-zinc-200 bg-white p-4">
        <Link
          href="/dashboard"
          className="mb-7 flex items-center gap-2 px-2 text-lg font-semibold"
        >
          <span className="grid size-8 place-items-center rounded-lg bg-brand-500 text-sm text-white">
            L
          </span>
          {PRODUCT.name}
        </Link>
        <nav className="space-y-1">
          {nav.map(([Icon, label, href]) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
            >
              <Icon size={17} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="absolute inset-x-4 bottom-4">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100"
          >
            <Settings size={17} />
            Settings
          </Link>
        </div>
      </aside>
      <main className="ml-60">
        <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-8">
          <div className="relative">
            <Search
              className="absolute left-3 top-2.5 text-zinc-400"
              size={16}
            />
            <input
              aria-label="Search"
              placeholder="Search sites, contacts and content"
              className="w-80 rounded-lg border border-zinc-200 py-2 pl-9 pr-3 text-sm"
            />
          </div>
          <button
            onClick={signOut}
            disabled={signingOut}
            className="grid size-9 place-items-center rounded-full bg-zinc-900 text-sm font-medium text-white"
            aria-label="Sign out"
            title="Sign out"
          >
            JD
          </button>
        </header>
        {children}
      </main>
    </div>
  );
}
