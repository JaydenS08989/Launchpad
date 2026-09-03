import { Construction, Rocket } from "lucide-react";
import { PRODUCT } from "@/lib";
export function MaintenanceScreen() {
  return (
    <main className="grid min-h-screen place-items-center bg-zinc-50 p-6">
      <section className="max-w-md text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-xl bg-brand-500 text-white">
          <Rocket size={22} />
        </span>
        <Construction className="mx-auto mt-10 text-zinc-400" size={30} />
        <h1 className="mt-5 text-2xl font-semibold tracking-tight">
          We’ll be back shortly
        </h1>
        <p className="mt-3 leading-7 text-zinc-600">
          {PRODUCT.name} is undergoing planned maintenance. Your work is safe,
          and access will be restored as soon as the update is complete.
        </p>
      </section>
    </main>
  );
}
