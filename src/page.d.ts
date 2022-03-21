import { Setting } from "@/__generated__/queries/queries.graphql";
import { NextPage } from "next";
import { ComponentType, ReactElement, ReactNode } from "react";

export type Page<P = {}> = NextPage<P> & {
  layout?: ComponentType<{ settings: Setting }>;
  needsAuth?: boolean;
};

declare global {
  interface Window {
    dataLayer: any;
    gtag: any;
    ga: any;
    rg4js: (fn: string, params: Record<string, any>) => void;
  }
}
