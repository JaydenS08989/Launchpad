import NextApp, {
  type AppContext,
  type AppInitialProps,
  type AppProps,
} from "next/app";
import type { NextComponentType } from "next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { MaintenanceScreen } from "@/components";
import { FeatureFlagsProvider } from "@/contexts";
import {
  defaultFeatureFlags,
  readFeatureFlags,
  type FeatureFlags,
} from "@/lib";
import "@/styles/globals.css";

export interface LaunchpadAppProps extends AppProps {
  featureFlags: FeatureFlags;
}
type LaunchpadInitialProps = AppInitialProps & { featureFlags: FeatureFlags };
let clientFeatureFlags = defaultFeatureFlags;

const LaunchpadApp: NextComponentType<
  AppContext,
  LaunchpadInitialProps,
  LaunchpadAppProps
> = ({ Component, pageProps, featureFlags }) => {
  clientFeatureFlags = featureFlags;
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
        },
      }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      <FeatureFlagsProvider flags={featureFlags}>
        {featureFlags.maintenance ? (
          <MaintenanceScreen />
        ) : (
          <Component {...pageProps} />
        )}
      </FeatureFlagsProvider>
    </QueryClientProvider>
  );
};

LaunchpadApp.getInitialProps = async (
  context: AppContext,
): Promise<LaunchpadInitialProps> => {
  const initialProps = await NextApp.getInitialProps(context);
  const featureFlags = context.ctx.req
    ? readFeatureFlags(process.env)
    : clientFeatureFlags;
  return { ...initialProps, featureFlags };
};

export default LaunchpadApp;
