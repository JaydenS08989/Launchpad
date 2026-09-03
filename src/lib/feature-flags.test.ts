import { describe, expect, it } from "vitest";
import { readFeatureFlags } from "./index";
describe("feature flags", () => {
  it("is fail-closed by default", () =>
    expect(readFeatureFlags({})).toEqual({
      maintenance: false,
      billing: false,
      developerMode: false,
      analytics: false,
    }));
  it("only enables an explicit true value", () =>
    expect(
      readFeatureFlags({ MAINTENANCE_MODE: "TRUE", FEATURE_BILLING: "1" }),
    ).toMatchObject({ maintenance: true, billing: false }));
});
