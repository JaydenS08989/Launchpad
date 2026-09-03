import { useCallback, useEffect, useState } from "react";
import { createTemplateDocument, sitesSchema, type Site } from "@/lib";

const STORAGE_KEY = "launchpad:sites";

function readSites(): Site[] {
  if (typeof window === "undefined") return [];
  try {
    const result = sitesSchema.safeParse(
      JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"),
    );
    return result.success ? result.data : [];
  } catch {
    return [];
  }
}

export function useSites() {
  const [sites, setSites] = useState<Site[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setSites(readSites());
    setReady(true);
  }, []);
  const persist = useCallback((next: Site[]) => {
    setSites(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);
  const createSite = useCallback(
    (templateId: string) => {
      const id = crypto.randomUUID();
      const site: Site = {
        id,
        name: templateId === "blank" ? "Untitled site" : "My new site",
        templateId,
        status: "draft",
        updatedAt: new Date().toISOString(),
        document: JSON.stringify(createTemplateDocument(templateId)),
      };
      persist([site, ...readSites()]);
      return site;
    },
    [persist],
  );
  const removeSite = useCallback(
    (id: string) => persist(readSites().filter((site) => site.id !== id)),
    [persist],
  );
  const updateSite = useCallback(
    (
      id: string,
      patch: Partial<Pick<Site, "name" | "status" | "document">>,
    ) => {
      const next = readSites().map((site) =>
        site.id === id
          ? { ...site, ...patch, updatedAt: new Date().toISOString() }
          : site,
      );
      persist(next);
    },
    [persist],
  );
  const getSite = useCallback(
    (id: string) => readSites().find((site) => site.id === id),
    [],
  );
  return { sites, ready, createSite, removeSite, updateSite, getSite };
}
