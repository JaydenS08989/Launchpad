import { useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Cloud,
  Eye,
  Monitor,
  Plus,
  Redo2,
  Save,
  Smartphone,
  Tablet,
  Undo2,
} from "lucide-react";
import { useRouter } from "next/router";
import type { EditorDocument, EditorNode } from "@/lib/editor-schema";
import { editorDocumentSchema } from "@/lib/editor-schema";
import { useEditorStore } from "@/stores/editor";
const base = (): EditorDocument => {
  const now = new Date().toISOString();
  return {
    schemaVersion: 1,
    pageId: "home",
    rootId: "root",
    updatedAt: now,
    nodes: {
      root: {
        id: "root",
        type: "section",
        parentId: null,
        children: ["container"],
        props: {},
        styles: { desktop: { background: "#f4f1ff" } },
        accessibility: { hidden: false },
      },
      container: {
        id: "container",
        type: "container",
        parentId: "root",
        children: ["heading", "text", "button"],
        props: {},
        styles: { desktop: {} },
        accessibility: { hidden: false },
      },
      heading: {
        id: "heading",
        type: "heading",
        parentId: "container",
        children: [],
        props: { text: "Build something remarkable." },
        styles: { desktop: {} },
        accessibility: { hidden: false },
      },
      text: {
        id: "text",
        type: "text",
        parentId: "container",
        children: [],
        props: { text: "A thoughtful digital studio for ambitious ideas." },
        styles: { desktop: {} },
        accessibility: { hidden: false },
      },
      button: {
        id: "button",
        type: "button",
        parentId: "container",
        children: [],
        props: { text: "Start a project" },
        styles: { desktop: {} },
        accessibility: { hidden: false },
      },
    },
  };
};
export default function Editor() {
  const router = useRouter(),
    siteId = String(router.query.siteId ?? "site");
  const s = useEditorStore();
  useEffect(() => {
    if (!router.isReady) return;
    const raw = localStorage.getItem(`launchpad:site:${siteId}`);
    const parsed = raw ? editorDocumentSchema.safeParse(JSON.parse(raw)) : null;
    s.setDocument(parsed?.success ? parsed.data : base());
  }, [router.isReady, siteId]);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        e.shiftKey ? s.redo() : s.undo();
      }
    };
    addEventListener("keydown", handler);
    return () => removeEventListener("keydown", handler);
  }, [s.undo, s.redo]);
  const selected = s.selectedId && s.document?.nodes[s.selectedId];
  const width = { desktop: "100%", tablet: "768px", mobile: "390px" }[
    s.viewport
  ];
  const add = (type: EditorNode["type"]) => {
    const id = crypto.randomUUID();
    s.addNode({
      id,
      type,
      parentId: "container",
      children: [],
      props: {
        text:
          type === "heading"
            ? "New heading"
            : type === "button"
              ? "Button"
              : "Add your copy here",
      },
      styles: { desktop: {} },
      accessibility: { hidden: false },
    });
  };
  const save = () => {
    if (!s.document) return;
    localStorage.setItem(
      `launchpad:site:${siteId}`,
      JSON.stringify(s.document),
    );
    s.markSaved();
  };
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-zinc-100">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-3">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" aria-label="Back to dashboard">
            <ChevronLeft size={20} />
          </Link>
          <div>
            <p className="text-sm font-semibold">Northstar Studio</p>
            <p className="flex items-center gap-1 text-[11px] text-zinc-500">
              <Cloud size={11} />
              {s.dirty ? "Unsaved changes" : "Saved"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Tool label="Undo" onClick={s.undo} disabled={!s.past.length}>
            <Undo2 size={16} />
          </Tool>
          <Tool label="Redo" onClick={s.redo} disabled={!s.future.length}>
            <Redo2 size={16} />
          </Tool>
          <span className="mx-2 h-6 w-px bg-zinc-200" />
          {(["desktop", "tablet", "mobile"] as const).map((v) => {
            const I = { desktop: Monitor, tablet: Tablet, mobile: Smartphone }[
              v
            ];
            return (
              <Tool
                key={v}
                label={`${v} viewport`}
                active={s.viewport === v}
                onClick={() => s.setViewport(v)}
              >
                <I size={16} />
              </Tool>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm">
            <Eye size={15} />
            Preview
          </button>
          <button
            onClick={save}
            className="flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm"
          >
            <Save size={15} />
            Save
          </button>
          <button className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white">
            Publish
          </button>
        </div>
      </header>
      <div className="flex min-h-0 flex-1">
        <aside className="w-64 shrink-0 border-r border-zinc-200 bg-white">
          <div className="border-b border-zinc-200 p-4">
            <h2 className="text-sm font-semibold">Add elements</h2>
            <p className="mt-1 text-xs text-zinc-500">
              Select an element to add it.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 p-3">
            {(["heading", "text", "button", "image", "divider"] as const).map(
              (type) => (
                <button
                  key={type}
                  onClick={() => add(type)}
                  className="flex h-20 flex-col items-center justify-center gap-2 rounded-lg border border-zinc-200 text-xs font-medium capitalize hover:border-brand-500 hover:bg-indigo-50"
                >
                  <Plus size={16} />
                  {type}
                </button>
              ),
            )}
          </div>
          <div className="border-t border-zinc-200 p-4">
            <h2 className="text-sm font-semibold">Layers</h2>
            <div className="mt-3 space-y-1 text-xs">
              {s.document &&
                Object.values(s.document.nodes).map((n) => (
                  <button
                    onClick={() => s.select(n.id)}
                    key={n.id}
                    className={`block w-full rounded px-2 py-1.5 text-left capitalize ${s.selectedId === n.id ? "bg-indigo-50 text-brand-600" : "hover:bg-zinc-50"}`}
                    style={{ paddingLeft: `${8 + (n.parentId ? 12 : 0)}px` }}
                  >
                    {n.type}
                  </button>
                ))}
            </div>
          </div>
        </aside>
        <main className="min-w-0 flex-1 overflow-auto p-10">
          <div
            className="mx-auto min-h-[680px] overflow-hidden bg-white shadow-sm transition-[width]"
            style={{ width, maxWidth: "100%" }}
          >
            {s.document && (
              <Canvas
                document={s.document}
                selected={s.selectedId}
                select={s.select}
              />
            )}
          </div>
        </main>
        <aside className="w-72 shrink-0 border-l border-zinc-200 bg-white">
          <div className="border-b border-zinc-200 p-4">
            <h2 className="text-sm font-semibold">Inspector</h2>
            <p className="mt-1 text-xs capitalize text-zinc-500">
              {selected?.type ?? "Select an element"}
            </p>
          </div>
          {selected && "text" in selected.props && (
            <label className="block p-4 text-xs font-medium text-zinc-600">
              Content
              <textarea
                value={selected.props.text}
                onChange={(e) => s.updateSelected({ text: e.target.value })}
                className="mt-2 min-h-24 w-full resize-none rounded-lg border border-zinc-200 p-3 text-sm font-normal text-zinc-900"
              />
            </label>
          )}
          <div className="border-t border-zinc-200 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Responsive
            </h3>
            <p className="mt-2 text-xs leading-5 text-zinc-500">
              Values inherit from larger breakpoints until you override them.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
function Canvas({
  document,
  selected,
  select,
}: {
  document: EditorDocument;
  selected: string | null;
  select: (id: string) => void;
}) {
  const nodes = useMemo(() => document.nodes, [document]);
  return (
    <section
      className="flex min-h-[680px] items-center justify-center p-12"
      style={{ background: nodes.root.styles.desktop.background }}
    >
      <div className="max-w-xl text-center">
        {nodes.container.children.map((id) => {
          const n = nodes[id],
            active = selected === id,
            cls = `relative rounded-sm outline-offset-4 ${active ? "outline outline-2 outline-brand-500" : "hover:outline hover:outline-1 hover:outline-indigo-300"}`;
          if (n.type === "heading")
            return (
              <h1
                onClick={() => select(id)}
                className={`${cls} text-5xl font-semibold tracking-tight`}
                key={id}
              >
                {n.props.text}
              </h1>
            );
          if (n.type === "text")
            return (
              <p
                onClick={() => select(id)}
                className={`${cls} mx-auto mt-6 max-w-md text-lg leading-8 text-zinc-600`}
                key={id}
              >
                {n.props.text}
              </p>
            );
          if (n.type === "button")
            return (
              <button
                onClick={() => select(id)}
                className={`${cls} mt-8 rounded-lg bg-zinc-900 px-5 py-3 text-sm font-medium text-white`}
                key={id}
              >
                {n.props.text}
              </button>
            );
          if (n.type === "divider")
            return (
              <hr
                onClick={() => select(id)}
                className={`${cls} my-8`}
                key={id}
              />
            );
          return (
            <div
              onClick={() => select(id)}
              className={`${cls} mt-6 rounded-lg border border-dashed border-zinc-300 p-8 text-sm text-zinc-400`}
              key={id}
            >
              {n.type}
            </div>
          );
        })}
      </div>
    </section>
  );
}
function Tool({
  label,
  children,
  onClick,
  active,
  disabled,
}: {
  label: string;
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={`grid size-8 place-items-center rounded-md disabled:opacity-30 ${active ? "bg-zinc-900 text-white" : "hover:bg-zinc-100"}`}
    >
      {children}
    </button>
  );
}
