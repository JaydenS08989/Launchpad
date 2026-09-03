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
import { useFeatureFlags } from "@/contexts";
const nav = [
  {
    icon: LayoutDashboard,
    label: "Overview",
    href: "/dashboard",
    available: true,
  },
  { icon: PanelsTopLeft, label: "Sites", href: "/dashboard", available: true },
  {
    icon: ContactRound,
    label: "CRM",
    href: "/dashboard/crm",
    available: false,
  },
  { icon: BookOpen, label: "CMS", href: "/dashboard/cms", available: true },
  {
    icon: FileText,
    label: "Forms",
    href: "/dashboard/forms",
    available: false,
  },
  {
    icon: Globe2,
    label: "Domains",
    href: "/dashboard/domains",
    available: false,
  },
] as const;
export function AppShell({ children }: { children: ReactNode }) {
  const { signOut, signingOut } = useSignOut();
  const flags = useFeatureFlags();
  const navigation = [
    ...nav,
    {
      icon: BarChart3,
      label: "Analytics",
      href: "/dashboard/analytics",
      available: flags.analytics,
    },
    {
      icon: Code2,
      label: "Developer",
      href: "/dashboard/developer",
      available: flags.developerMode,
    },
  ];
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
          {navigation.map(({ icon: Icon, label, href, available }) =>
            available ? (
              <Link
                key={label}
                href={href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
              >
                <Icon size={17} />
                {label}
              </Link>
            ) : (
              <span
                key={label}
                aria-disabled="true"
                title={`${label} is not enabled`}
                className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-400"
              >
                <Icon size={17} />
                {label}
                <span className="ml-auto text-[10px] font-medium uppercase tracking-wide">
                  Soon
                </span>
              </span>
            ),
          )}
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
