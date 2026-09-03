import { useMemo, useState } from "react";
import { templates } from "@/lib";

export function useTemplateBrowser() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const filteredTemplates = useMemo(
    () =>
      templates.filter((template) => {
        const categoryMatches =
          category === "All" || template.category === category;
        const queryMatches = `${template.name} ${template.description}`
          .toLowerCase()
          .includes(query.toLowerCase());
        return categoryMatches && queryMatches;
      }),
    [category, query],
  );
  return { query, setQuery, category, setCategory, filteredTemplates };
}
