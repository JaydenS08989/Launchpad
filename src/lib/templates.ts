import type { EditorDocument } from "./editor-schema";

export type Template = {
  id: string;
  name: string;
  description: string;
  category: string;
  palette: string;
};

export const templates: readonly Template[] = [
  {
    id: "blank",
    name: "Blank canvas",
    description: "Start with a flexible empty page",
    category: "Business",
    palette: "from-white to-zinc-100",
  },
  {
    id: "studio",
    name: "Creative studio",
    description: "A bold portfolio for independent teams",
    category: "Portfolio",
    palette: "from-indigo-100 to-orange-100",
  },
  {
    id: "restaurant",
    name: "Modern restaurant",
    description: "Menus, reservations and rich imagery",
    category: "Restaurant",
    palette: "from-amber-100 to-red-100",
  },
  {
    id: "consulting",
    name: "Consultancy",
    description: "A refined service-led business presence",
    category: "Services",
    palette: "from-sky-100 to-slate-100",
  },
] as const;

export function createTemplateDocument(templateId: string): EditorDocument {
  const template =
    templates.find(({ id }) => id === templateId) ?? templates[0];
  const isBlank = template.id === "blank";
  return {
    schemaVersion: 1,
    pageId: "home",
    rootId: "root",
    updatedAt: new Date().toISOString(),
    nodes: {
      root: {
        id: "root",
        type: "section",
        parentId: null,
        children: ["container"],
        props: {},
        styles: { desktop: { background: isBlank ? "#ffffff" : "#f4f1ff" } },
        accessibility: { hidden: false },
      },
      container: {
        id: "container",
        type: "container",
        parentId: "root",
        children: isBlank ? [] : ["heading", "text", "button"],
        props: {},
        styles: { desktop: {} },
        accessibility: { hidden: false },
      },
      ...(isBlank
        ? {}
        : {
            heading: {
              id: "heading",
              type: "heading" as const,
              parentId: "container",
              children: [],
              props: { text: template.name },
              styles: { desktop: {} },
              accessibility: { hidden: false },
            },
            text: {
              id: "text",
              type: "text" as const,
              parentId: "container",
              children: [],
              props: { text: template.description },
              styles: { desktop: {} },
              accessibility: { hidden: false },
            },
            button: {
              id: "button",
              type: "button" as const,
              parentId: "container",
              children: [],
              props: { text: "Get started" },
              styles: { desktop: {} },
              accessibility: { hidden: false },
            },
          }),
    },
  };
}
