import Link from "next/link";
import { ArrowLeft, LayoutTemplate, Search } from "lucide-react";
import { PRODUCT } from "@/lib/product";
const templates = [
  [
    "blank",
    "Blank canvas",
    "Start with a flexible empty page",
    "from-white to-zinc-100",
  ],
  [
    "studio",
    "Creative studio",
    "A bold portfolio for independent teams",
    "from-indigo-100 to-orange-100",
  ],
  [
    "restaurant",
    "Modern restaurant",
    "Menus, reservations and rich imagery",
    "from-amber-100 to-red-100",
  ],
  [
    "consulting",
    "Consultancy",
    "A refined service-led business presence",
    "from-sky-100 to-slate-100",
  ],
];
export default function Templates() {
  return (
    <main className="min-h-screen bg-white">
      <header className="flex h-16 items-center justify-between border-b border-zinc-200 px-7">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" aria-label="Back to dashboard">
            <ArrowLeft size={19} />
          </Link>
          <span className="font-semibold">{PRODUCT.name}</span>
          <span className="text-zinc-300">/</span>
          <span className="text-sm text-zinc-600">Choose a template</span>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-8 py-12">
        <h1 className="text-4xl font-semibold tracking-tight">
          Start with a strong foundation
        </h1>
        <p className="mt-3 text-zinc-500">
          Every template is responsive and completely editable.
        </p>
        <div className="mt-8 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-zinc-400" size={17} />
            <input
              className="w-full rounded-lg border border-zinc-200 py-2.5 pl-10 pr-4 text-sm"
              placeholder="Search templates"
            />
          </div>
          {["All", "Business", "Portfolio", "Restaurant", "Services"].map(
            (x, i) => (
              <button
                key={x}
                className={`rounded-lg px-4 text-sm ${i === 0 ? "bg-zinc-900 text-white" : "border border-zinc-200"}`}
              >
                {x}
              </button>
            ),
          )}
        </div>
        <div className="mt-8 grid grid-cols-3 gap-7">
          {templates.map(([id, name, desc, colour]) => (
            <article key={id} className="group">
              <div
                className={`relative aspect-[4/3] overflow-hidden rounded-xl border border-zinc-200 bg-gradient-to-br ${colour}`}
              >
                <LayoutTemplate
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-zinc-400"
                  size={52}
                />
                <Link
                  href={`/editor/${id}`}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
                >
                  Use template
                </Link>
              </div>
              <h2 className="mt-3 font-semibold">{name}</h2>
              <p className="mt-1 text-sm text-zinc-500">{desc}</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
