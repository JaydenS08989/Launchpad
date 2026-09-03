import { create } from "zustand";
import type { EditorDocument, EditorNode } from "@/lib";
type Viewport = "desktop" | "tablet" | "mobile";
type Snapshot = { document: EditorDocument };
type State = {
  document: EditorDocument | null;
  selectedId: string | null;
  viewport: Viewport;
  past: Snapshot[];
  future: Snapshot[];
  dirty: boolean;
  setDocument: (d: EditorDocument) => void;
  select: (id: string | null) => void;
  setViewport: (v: Viewport) => void;
  addNode: (n: EditorNode) => void;
  updateSelected: (patch: Partial<EditorNode["props"]>) => void;
  undo: () => void;
  redo: () => void;
  markSaved: () => void;
};
const clone = (d: EditorDocument) => structuredClone(d);
export const useEditorStore = create<State>((set, get) => ({
  document: null,
  selectedId: null,
  viewport: "desktop",
  past: [],
  future: [],
  dirty: false,
  setDocument: (document) =>
    set({ document, past: [], future: [], dirty: false }),
  select: (selectedId) => set({ selectedId }),
  setViewport: (viewport) => set({ viewport }),
  addNode: (n) => {
    const d = get().document;
    if (!d) return;
    const next = clone(d);
    next.nodes[n.id] = n;
    next.nodes[n.parentId!].children.push(n.id);
    next.updatedAt = new Date().toISOString();
    set({
      document: next,
      past: [...get().past, { document: clone(d) }].slice(-50),
      future: [],
      selectedId: n.id,
      dirty: true,
    });
  },
  updateSelected: (patch) => {
    const { document: d, selectedId } = get();
    if (!d || !selectedId) return;
    const next = clone(d);
    next.nodes[selectedId].props = {
      ...next.nodes[selectedId].props,
      ...patch,
    };
    next.updatedAt = new Date().toISOString();
    set({
      document: next,
      past: [...get().past, { document: clone(d) }].slice(-50),
      future: [],
      dirty: true,
    });
  },
  undo: () => {
    const { past, document } = get();
    if (!document || !past.length) return;
    const previous = past.at(-1)!;
    set({
      document: clone(previous.document),
      past: past.slice(0, -1),
      future: [{ document: clone(document) }, ...get().future],
      dirty: true,
    });
  },
  redo: () => {
    const { future, document } = get();
    if (!document || !future.length) return;
    set({
      document: clone(future[0].document),
      past: [...get().past, { document: clone(document) }],
      future: future.slice(1),
      dirty: true,
    });
  },
  markSaved: () => set({ dirty: false }),
}));
