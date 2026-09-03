import { useState, type FormEvent } from "react";
import { Database, Plus, Trash2 } from "lucide-react";
import { AppShell } from "@/components";
import { cmsFieldTypes, type CmsCollection } from "@/lib";
import { useCms } from "@/hooks";

export default function CmsPage() {
  const cms = useCms();
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [fieldOpen, setFieldOpen] = useState(false);
  const [recordOpen, setRecordOpen] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const createCollection = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    cms.createCollection(String(form.get("name")));
    setCollectionOpen(false);
  };
  const addField = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!cms.selected) return;
    const form = new FormData(event.currentTarget);
    cms.addField(cms.selected.id, {
      name: String(form.get("name")),
      type: String(form.get("type")) as (typeof cmsFieldTypes)[number],
      required: form.get("required") === "on",
    });
    setFieldOpen(false);
  };
  const addRecord = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!cms.selected) return;
    const form = new FormData(event.currentTarget);
    const values = Object.fromEntries(
      cms.selected.fields.map((field) => [
        field.key,
        normaliseValue(field.type, form.get(field.key)),
      ]),
    );
    const issues = cms.createRecord(cms.selected, values);
    setErrors(issues);
    if (!issues.length) setRecordOpen(false);
  };
  return (
    <AppShell>
      <div className="flex h-[calc(100vh-4rem)]">
        <aside className="w-64 border-r border-zinc-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <h1 className="font-semibold">Content</h1>
            <button
              onClick={() => setCollectionOpen(true)}
              aria-label="Create collection"
              className="grid size-8 place-items-center rounded-md hover:bg-zinc-100"
            >
              <Plus size={16} />
            </button>
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            Collections organise reusable site content.
          </p>
          <div className="mt-5 space-y-1">
            {cms.collections.map((collection) => (
              <button
                key={collection.id}
                onClick={() => cms.setSelectedId(collection.id)}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${cms.selected?.id === collection.id ? "bg-indigo-50 font-medium text-brand-600" : "text-zinc-600 hover:bg-zinc-50"}`}
              >
                <Database size={15} />
                {collection.name}
              </button>
            ))}
          </div>
        </aside>
        <main className="min-w-0 flex-1 overflow-auto p-8">
          {cms.selected ? (
            <CollectionView
              collection={cms.selected}
              records={cms.records}
              onAddField={() => setFieldOpen(true)}
              onAddRecord={() => setRecordOpen(true)}
              onDelete={cms.deleteRecord}
            />
          ) : (
            <Empty onCreate={() => setCollectionOpen(true)} />
          )}
        </main>
      </div>
      {collectionOpen && (
        <Modal title="Create collection" close={() => setCollectionOpen(false)}>
          <form onSubmit={createCollection}>
            <TextInput label="Collection name" name="name" />
            <Submit>Create collection</Submit>
          </form>
        </Modal>
      )}
      {fieldOpen && (
        <Modal title="Add field" close={() => setFieldOpen(false)}>
          <form onSubmit={addField} className="space-y-4">
            <TextInput label="Field name" name="name" />
            <label className="block text-sm font-medium">
              Type
              <select
                name="type"
                className="mt-2 w-full rounded-lg border border-zinc-200 p-2.5 font-normal"
              >
                {cmsFieldTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </label>
            <label className="flex gap-2 text-sm">
              <input name="required" type="checkbox" />
              Required field
            </label>
            <Submit>Add field</Submit>
          </form>
        </Modal>
      )}
      {recordOpen && cms.selected && (
        <Modal
          title={`Add ${cms.selected.name} item`}
          close={() => setRecordOpen(false)}
        >
          <form onSubmit={addRecord} className="space-y-4">
            {cms.selected.fields.map((field) => (
              <TextInput
                key={field.id}
                label={field.name}
                name={field.key}
                type={
                  field.type === "number"
                    ? "number"
                    : field.type === "email"
                      ? "email"
                      : field.type === "url"
                        ? "url"
                        : "text"
                }
              />
            ))}
            {errors.length > 0 && (
              <ul className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            )}
            <Submit>Save draft</Submit>
          </form>
        </Modal>
      )}
    </AppShell>
  );
}
function CollectionView({
  collection,
  records,
  onAddField,
  onAddRecord,
  onDelete,
}: {
  collection: CmsCollection;
  records: ReturnType<typeof useCms>["records"];
  onAddField: () => void;
  onAddRecord: () => void;
  onDelete: (id: string) => void;
}) {
  return (
    <>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm text-zinc-500">Collection</p>
          <h2 className="mt-1 text-2xl font-semibold">{collection.name}</h2>
          <p className="mt-1 text-sm text-zinc-500">
            /{collection.slug} · {records.length} items
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onAddField}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium"
          >
            Manage fields
          </button>
          <button
            onClick={onAddRecord}
            disabled={!collection.fields.length}
            className="rounded-lg bg-brand-500 px-3 py-2 text-sm font-medium text-white disabled:opacity-40"
          >
            Add item
          </button>
        </div>
      </div>
      <div className="mt-7 overflow-hidden rounded-xl border border-zinc-200 bg-white">
        {records.length ? (
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-zinc-500">
              <tr>
                <th className="p-3 font-medium">Status</th>
                {collection.fields.slice(0, 3).map((field) => (
                  <th className="p-3 font-medium" key={field.id}>
                    {field.name}
                  </th>
                ))}
                <th />
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr className="border-t border-zinc-100" key={record.id}>
                  <td className="p-3 capitalize">{record.status}</td>
                  {collection.fields.slice(0, 3).map((field) => (
                    <td className="max-w-52 truncate p-3" key={field.id}>
                      {String(record.values[field.key] ?? "—")}
                    </td>
                  ))}
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onDelete(record.id)}
                      aria-label="Delete item"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center text-sm text-zinc-500">
            No items yet. Add fields, then create your first item.
          </div>
        )}
      </div>
    </>
  );
}
function Empty({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="grid h-full place-items-center">
      <div className="text-center">
        <Database className="mx-auto text-zinc-400" size={32} />
        <h2 className="mt-4 font-semibold">Create your first collection</h2>
        <p className="mt-2 max-w-sm text-sm text-zinc-500">
          Structure articles, products, team members or any content your sites
          need.
        </p>
        <button
          onClick={onCreate}
          className="mt-5 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
        >
          Create collection
        </button>
      </div>
    </div>
  );
}
function Modal({
  title,
  close,
  children,
}: {
  title: string;
  close: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
      onMouseDown={close}
    >
      <div
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex justify-between">
          <h2 className="font-semibold">{title}</h2>
          <button onClick={close} aria-label="Close">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
function TextInput({
  label,
  name,
  type = "text",
}: {
  label: string;
  name: string;
  type?: string;
}) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <input
        required
        name={name}
        type={type}
        className="mt-2 w-full rounded-lg border border-zinc-200 p-2.5 font-normal"
      />
    </label>
  );
}
function Submit({ children }: { children: React.ReactNode }) {
  return (
    <button className="mt-5 w-full rounded-lg bg-brand-500 p-2.5 text-sm font-medium text-white">
      {children}
    </button>
  );
}
function normaliseValue(type: string, value: FormDataEntryValue | null) {
  if (type === "number") return Number(value);
  if (type === "boolean") return value === "on";
  return String(value ?? "");
}
