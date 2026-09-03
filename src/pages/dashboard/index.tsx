import Link from "next/link";
import {
  ArrowUpRight,
  Globe2,
  MoreHorizontal,
  Plus,
  Rocket,
  Users,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
export default function Dashboard() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl p-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="mb-1 text-sm text-zinc-500">Thursday, 3 September</p>
            <h1 className="text-3xl font-semibold tracking-tight">
              Good afternoon, Jamie
            </h1>
          </div>
          <Link
            href="/templates"
            className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
          >
            <Plus size={17} />
            Create site
          </Link>
        </div>
        <section className="mt-8 grid grid-cols-3 gap-4">
          <Metric
            icon={Globe2}
            label="Live sites"
            value="1"
            note="All systems operational"
          />
          <Metric
            icon={Users}
            label="Contacts"
            value="0"
            note="No new contacts yet"
          />
          <Metric
            icon={Rocket}
            label="Current plan"
            value="Free"
            note="Explore premium features"
          />
        </section>
        <div className="mt-10 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your sites</h2>
          <Link
            href="/dashboard/sites"
            className="text-sm font-medium text-brand-600"
          >
            View all
          </Link>
        </div>
        <section className="mt-4 overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <div className="grid grid-cols-[220px_1fr_auto] gap-6 p-4">
            <div className="grid h-32 place-items-center rounded-lg bg-gradient-to-br from-indigo-100 to-orange-50">
              <span className="text-xl font-semibold text-indigo-950">
                Northstar Studio
              </span>
            </div>
            <div className="py-2">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">Northstar Studio</h3>
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                  Published
                </span>
              </div>
              <p className="mt-2 text-sm text-zinc-500">
                Edited a few moments ago · launchpad.site/northstar
              </p>
              <div className="mt-7 flex gap-2">
                <Link
                  href="/editor/northstar"
                  className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white"
                >
                  Edit site
                </Link>
                <button className="rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium">
                  Manage site
                </button>
              </div>
            </div>
            <button
              aria-label="More site actions"
              className="size-9 rounded-lg hover:bg-zinc-100"
            >
              <MoreHorizontal className="m-auto" size={18} />
            </button>
          </div>
        </section>
        <section className="mt-8 grid grid-cols-2 gap-5">
          <div className="rounded-xl border border-zinc-200 bg-white p-5">
            <h2 className="font-semibold">Get your site ready</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Two recommended steps remain.
            </p>
            <div className="mt-5 h-2 rounded-full bg-zinc-100">
              <div className="h-full w-2/3 rounded-full bg-brand-500" />
            </div>
            <button className="mt-5 flex items-center gap-1 text-sm font-medium text-brand-600">
              Review recommendations <ArrowUpRight size={15} />
            </button>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-5">
            <h2 className="font-semibold">Recent activity</h2>
            <div className="mt-4 border-l-2 border-indigo-100 pl-4">
              <p className="text-sm font-medium">Site draft saved</p>
              <p className="text-xs text-zinc-500">
                Northstar Studio · a few moments ago
              </p>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
function Metric({
  icon: Icon,
  label,
  value,
  note,
}: {
  icon: typeof Globe2;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5">
      <div className="flex items-center gap-2 text-sm text-zinc-500">
        <Icon size={16} />
        {label}
      </div>
      <p className="mt-3 text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-xs text-zinc-500">{note}</p>
    </div>
  );
}
