import Link from "next/link";
import { Rocket } from "lucide-react";
import { useAuthForm } from "@/hooks";
import { PRODUCT } from "@/lib";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const { error, submitting, submit } = useAuthForm(mode);
  const registering = mode === "register";
  return (
    <main className="grid min-h-screen place-items-center bg-zinc-50 p-6">
      <section className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="mb-8 flex items-center gap-2 font-semibold">
          <span className="grid size-9 place-items-center rounded-lg bg-brand-500 text-white">
            <Rocket size={18} />
          </span>
          {PRODUCT.name}
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {registering ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          {registering
            ? "Set up your workspace in a few moments."
            : "Sign in to continue to your workspace."}
        </p>
        <form onSubmit={submit} className="mt-7 space-y-4">
          {registering && (
            <Field label="Name" name="name" autoComplete="name" />
          )}
          <Field
            label="E-mail address"
            name="email"
            type="email"
            autoComplete="email"
          />
          <Field
            label="Password"
            name="password"
            type="password"
            autoComplete={registering ? "new-password" : "current-password"}
            hint={registering ? "Use at least 12 characters." : undefined}
          />
          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}
          <button
            disabled={submitting}
            className="w-full rounded-lg bg-brand-500 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-60"
          >
            {submitting
              ? "Please wait…"
              : registering
                ? "Create account"
                : "Sign in"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-zinc-500">
          {registering ? "Already have an account?" : "New to Launchpad?"}{" "}
          <Link
            className="font-medium text-brand-600"
            href={registering ? "/login" : "/register"}
          >
            {registering ? "Sign in" : "Create an account"}
          </Link>
        </p>
      </section>
    </main>
  );
}
function Field({
  label,
  name,
  type = "text",
  autoComplete,
  hint,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete: string;
  hint?: string;
}) {
  return (
    <label className="block text-sm font-medium text-zinc-700">
      {label}
      <input
        required
        name={name}
        type={type}
        autoComplete={autoComplete}
        className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-2.5 font-normal"
      />
      {hint && (
        <span className="mt-1 block text-xs font-normal text-zinc-500">
          {hint}
        </span>
      )}
    </label>
  );
}
