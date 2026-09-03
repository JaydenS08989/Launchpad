import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { editorDocumentSchema, type EditorNode } from "@/lib";
import { siteService } from "@/server";

export const getServerSideProps: GetServerSideProps<{
  document: string;
}> = async ({ params }) => {
  const version = await siteService.publicVersion(String(params?.siteId));
  if (!version) return { notFound: true };
  return { props: { document: version.document } };
};
export default function PublishedSite({
  document,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const parsed = editorDocumentSchema.safeParse(JSON.parse(document));
  if (!parsed.success) return null;
  const root = parsed.data.nodes[parsed.data.rootId];
  return (
    <>
      <Head>
        <title>Published site</title>
      </Head>
      <main>
        {root.children.map((id) => (
          <PublishedNode
            key={id}
            node={parsed.data.nodes[id]}
            nodes={parsed.data.nodes}
          />
        ))}
      </main>
    </>
  );
}
function PublishedNode({
  node,
  nodes,
}: {
  node: EditorNode;
  nodes: Record<string, EditorNode>;
}) {
  const children = node.children.map((id) => (
    <PublishedNode key={id} node={nodes[id]} nodes={nodes} />
  ));
  if (node.type === "section")
    return (
      <section
        className="flex min-h-screen items-center justify-center p-10"
        style={{ background: node.styles.desktop.background }}
      >
        {children}
      </section>
    );
  if (node.type === "container")
    return <div className="mx-auto max-w-3xl text-center">{children}</div>;
  if (node.type === "heading")
    return (
      <h1 className="text-5xl font-semibold tracking-tight">
        {node.props.text}
      </h1>
    );
  if (node.type === "text")
    return (
      <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-zinc-600">
        {node.props.text}
      </p>
    );
  if (node.type === "button")
    return (
      <a
        href={safeHref(node.props.href)}
        className="mt-8 inline-flex rounded-lg bg-zinc-900 px-5 py-3 text-sm font-medium text-white"
      >
        {node.props.text}
      </a>
    );
  if (node.type === "divider") return <hr className="my-8" />;
  if (node.type === "image")
    return node.props.src ? (
      <>
        {" "}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={node.props.src}
          alt={node.accessibility.label ?? ""}
          className="mt-6 max-w-full"
        />
      </>
    ) : null;
  return null;
}
function safeHref(value: string | undefined) {
  if (!value) return "#";
  try {
    const url = new URL(value, "https://launchpad.invalid");
    return ["http:", "https:", "mailto:", "tel:"].includes(url.protocol)
      ? value
      : "#";
  } catch {
    return "#";
  }
}
