import { z } from "zod";

export const featureFlagsSchema = z.object({
  maintenance: z.boolean(),
  billing: z.boolean(),
  developerMode: z.boolean(),
  analytics: z.boolean(),
});
export type FeatureFlags = z.infer<typeof featureFlagsSchema>;
export const defaultFeatureFlags: FeatureFlags = {
  maintenance: false,
  billing: false,
  developerMode: false,
  analytics: false,
};
const enabled = (value: string | undefined) => value?.toLowerCase() === "true";
export function readFeatureFlags(environment: NodeJS.ProcessEnv): FeatureFlags {
  return featureFlagsSchema.parse({
    maintenance: enabled(environment.MAINTENANCE_MODE),
    billing: enabled(environment.FEATURE_BILLING),
    developerMode: enabled(environment.FEATURE_DEVELOPER_MODE),
    analytics: enabled(environment.FEATURE_ANALYTICS),
  });
}
