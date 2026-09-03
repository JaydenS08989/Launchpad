import { useState } from "react";
import { useRouter } from "next/router";
import { PRODUCT } from "@/lib";
export function useSignOut() {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const signOut = async () => {
    setSigningOut(true);
    try {
      await fetch(`${PRODUCT.apiBase}/auth/logout`, { method: "POST" });
      await router.replace("/login");
    } finally {
      setSigningOut(false);
    }
  };
  return { signOut, signingOut };
}
