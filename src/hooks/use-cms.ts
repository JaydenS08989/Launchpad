import { useCallback, useEffect, useMemo, useState } from "react";
import {
  cmsWorkspaceSchema,
  validateCmsValues,
  type CmsCollection,
  type CmsField,
  type CmsRecord,
  type CmsWorkspace,
} from "@/lib";

const KEY = "launchpad:cms";
const empty: CmsWorkspace = { collections: [], records: [] };
function read(): CmsWorkspace {
  if (typeof window === "undefined") return empty;
  try {
    const parsed = cmsWorkspaceSchema.safeParse(
      JSON.parse(localStorage.getItem(KEY) ?? "{}"),
    );
    return parsed.success ? parsed.data : empty;
  } catch {
    return empty;
  }
}
export function useCms() {
  const [workspace, setWorkspace] = useState(read);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  useEffect(() => setWorkspace(read()), []);
  const persist = useCallback((next: CmsWorkspace) => {
    localStorage.setItem(KEY, JSON.stringify(next));
    setWorkspace(next);
  }, []);
  const selected = useMemo(
    () =>
      workspace.collections.find(({ id }) => id === selectedId) ??
      workspace.collections[0] ??
      null,
    [selectedId, workspace.collections],
  );
  const createCollection = useCallback(
    (name: string) => {
      const now = new Date().toISOString();
      const base =
        name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "") || "collection";
      let slug = base;
      let suffix = 2;
      while (workspace.collections.some((item) => item.slug === slug))
        slug = `${base}-${suffix++}`;
      const collection: CmsCollection = {
        id: crypto.randomUUID(),
        name,
        slug,
        fields: [],
        createdAt: now,
        updatedAt: now,
      };
      persist({
        ...workspace,
        collections: [...workspace.collections, collection],
      });
      setSelectedId(collection.id);
    },
    [persist, workspace],
  );
  const addField = useCallback(
    (
      collectionId: string,
      input: Pick<CmsField, "name" | "type" | "required">,
    ) => {
      const key = input.name
        .replace(/[^a-zA-Z0-9]+/g, " ")
        .trim()
        .split(/\s+/)
        .map((word, index) =>
          index ? word[0].toUpperCase() + word.slice(1) : word.toLowerCase(),
        )
        .join("");
      const field: CmsField = { ...input, id: crypto.randomUUID(), key };
      persist({
        ...workspace,
        collections: workspace.collections.map((collection) =>
          collection.id === collectionId
            ? {
                ...collection,
                fields: [...collection.fields, field],
                updatedAt: new Date().toISOString(),
              }
            : collection,
        ),
      });
    },
    [persist, workspace],
  );
  const createRecord = useCallback(
    (collection: CmsCollection, values: Record<string, unknown>) => {
      const issues = validateCmsValues(collection.fields, values);
      if (issues.length) return issues;
      const now = new Date().toISOString();
      const record: CmsRecord = {
        id: crypto.randomUUID(),
        collectionId: collection.id,
        status: "draft",
        values,
        createdAt: now,
        updatedAt: now,
      };
      persist({ ...workspace, records: [record, ...workspace.records] });
      return [];
    },
    [persist, workspace],
  );
  const deleteRecord = useCallback(
    (id: string) =>
      persist({
        ...workspace,
        records: workspace.records.filter((record) => record.id !== id),
      }),
    [persist, workspace],
  );
  const records = useMemo(
    () =>
      workspace.records.filter(
        ({ collectionId }) => collectionId === selected?.id,
      ),
    [selected?.id, workspace.records],
  );
  return {
    collections: workspace.collections,
    selected,
    selectedId,
    setSelectedId,
    records,
    createCollection,
    addField,
    createRecord,
    deleteRecord,
  };
}
