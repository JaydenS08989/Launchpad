import { createContext, useContext, type ReactNode } from "react";
import { defaultFeatureFlags, type FeatureFlags } from "@/lib";

const FeatureFlagsContext = createContext<FeatureFlags>(defaultFeatureFlags);
export function FeatureFlagsProvider({
  flags,
  children,
}: {
  flags: FeatureFlags;
  children: ReactNode;
}) {
  return (
    <FeatureFlagsContext.Provider value={flags}>
      {children}
    </FeatureFlagsContext.Provider>
  );
}
export function useFeatureFlags() {
  return useContext(FeatureFlagsContext);
}
