import { useState, type FormEvent } from "react";
import { useRouter } from "next/router";
import { PRODUCT } from "@/lib";

export function useAuthForm(mode: "login" | "register") {
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const values = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const response = await fetch(`${PRODUCT.apiBase}/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const payload = await response.json();
      if (!response.ok) {
        setError(
          payload.error?.message ?? "We could not complete that request",
        );
        return;
      }
      await router.replace("/dashboard");
    } catch {
      setError("The service is unavailable. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  return { error, submitting, submit };
}
