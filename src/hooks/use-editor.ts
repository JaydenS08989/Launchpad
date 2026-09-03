import { useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import { createTemplateDocument, editorDocumentSchema } from "@/lib";
import { useEditorStore } from "@/stores";
import { useSites } from "./use-sites";

export function useEditor() {
  const router = useRouter();
  const siteId = String(router.query.siteId ?? "");
  const editor = useEditorStore();
  const { getSite, updateSite } = useSites();
  useEffect(() => {
    if (!router.isReady) return;
    const site = getSite(siteId);
    const parsed = site
      ? editorDocumentSchema.safeParse(JSON.parse(site.document))
      : null;
    editor.setDocument(
      parsed?.success ? parsed.data : createTemplateDocument("blank"),
    );
  }, [router.isReady, siteId, getSite, editor.setDocument]);
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key !== "z") return;
      event.preventDefault();
      event.shiftKey ? editor.redo() : editor.undo();
    };
    addEventListener("keydown", handleKeydown);
    return () => removeEventListener("keydown", handleKeydown);
  }, [editor.redo, editor.undo]);
  const save = useCallback(() => {
    if (!editor.document || !siteId) return;
    void updateSite(siteId, { document: JSON.stringify(editor.document) }).then(
      editor.markSaved,
    );
  }, [editor.document, editor.markSaved, siteId, updateSite]);
  return { ...editor, siteId, site: getSite(siteId), save };
}
