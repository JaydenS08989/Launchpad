import Link from "next/link";
import { Globe2, Plus, Rocket, Users } from "lucide-react";
import { AppShell } from "@/components";
import { useSites } from "@/hooks";

export default function Dashboard() {
  const { sites, ready, removeSite } = useSites();
  const published = sites.filter(({ status }) => status === "published").length;
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl p-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="mb-1 text-sm text-zinc-500">Your workspace</p>
            <h1 className="text-3xl font-semibold tracking-tight">
              Good afternoon
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
            value={String(published)}
            note={published ? "Published and available" : "No published sites"}
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
        </div>
        {!ready ? (
          <div className="mt-4 h-44 animate-pulse rounded-xl bg-zinc-200" />
        ) : sites.length ? (
          <section className="mt-4 divide-y divide-zinc-100 overflow-hidden rounded-xl border border-zinc-200 bg-white">
            {sites.map((site) => (
              <article key={site.id} className="flex items-center gap-5 p-4">
                <div className="grid h-24 w-36 place-items-center rounded-lg bg-gradient-to-br from-indigo-100 to-orange-50 text-sm font-semibold text-indigo-950">
                  {site.name}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-semibold">{site.name}</h3>
                    <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-medium capitalize text-amber-700">
                      {site.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-zinc-500">
                    Edited{" "}
                    {new Date(site.updatedAt).toLocaleDateString("en-GB")}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Link
                      href={`/editor/${site.id}`}
                      className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white"
                    >
                      Edit site
                    </Link>
                    <button
                      onClick={() => removeSite(site.id)}
                      className="rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <section className="mt-4 rounded-xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
            <Globe2 className="mx-auto text-zinc-400" />
            <h3 className="mt-4 font-semibold">Create your first site</h3>
            <p className="mt-2 text-sm text-zinc-500">
              Choose a professionally designed template or begin with a blank
              canvas.
            </p>
            <Link
              href="/templates"
              className="mt-5 inline-flex rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
            >
              Browse templates
            </Link>
          </section>
        )}
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
