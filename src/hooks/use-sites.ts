import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { PRODUCT, siteSchema, sitesSchema, type Site } from "@/lib";

const key = ["sites"] as const;
async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const payload = response.status === 204 ? null : await response.json();
  if (!response.ok)
    throw new Error(payload?.error?.message ?? "The request failed");
  return payload as T;
}
export function useSites() {
  const client = useQueryClient();
  const query = useQuery({
    queryKey: key,
    queryFn: async () => {
      const payload = await request<{ data: { sites: unknown } }>(
        `${PRODUCT.apiBase}/sites`,
      );
      return sitesSchema.parse(payload.data.sites);
    },
  });
  const create = useMutation({
    mutationFn: async (input: { templateId: string; name?: string }) => {
      const payload = await request<{ data: { site: unknown } }>(
        `${PRODUCT.apiBase}/sites`,
        { method: "POST", body: JSON.stringify(input) },
      );
      return siteSchema.parse(payload.data.site);
    },
    onSuccess: (site) =>
      client.setQueryData<Site[]>(key, (current) => [site, ...(current ?? [])]),
  });
  const update = useMutation({
    mutationFn: async ({
      id,
      patch,
    }: {
      id: string;
      patch: Partial<Pick<Site, "name" | "status" | "document">>;
    }) => {
      const payload = await request<{ data: { site: unknown } }>(
        `${PRODUCT.apiBase}/sites/${id}`,
        { method: "PATCH", body: JSON.stringify(patch) },
      );
      return siteSchema.parse(payload.data.site);
    },
    onSuccess: (site) =>
      client.setQueryData<Site[]>(
        key,
        (current) =>
          current?.map((item) => (item.id === site.id ? site : item)) ?? [site],
      ),
  });
  const remove = useMutation({
    mutationFn: (id: string) =>
      request<null>(`${PRODUCT.apiBase}/sites/${id}`, { method: "DELETE" }),
    onSuccess: (_, id) =>
      client.setQueryData<Site[]>(
        key,
        (current) => current?.filter((site) => site.id !== id) ?? [],
      ),
  });
  const getSite = useCallback(
    (id: string) => query.data?.find((site) => site.id === id),
    [query.data],
  );
  return {
    sites: query.data ?? [],
    ready: !query.isLoading,
    error: query.error,
    createSite: (templateId: string, name?: string) =>
      create.mutateAsync({ templateId, name }),
    removeSite: remove.mutate,
    updateSite: (
      id: string,
      patch: Partial<Pick<Site, "name" | "status" | "document">>,
    ) => update.mutateAsync({ id, patch }),
    getSite,
    isCreating: create.isPending,
  };
}
