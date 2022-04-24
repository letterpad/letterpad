import { Setting } from "@graphql-types@";
import { NextPage } from "next";
import { ComponentType, ReactElement, ReactNode } from "react";

export type Page<P = {}> = NextPage<P> & {
  // Does not need any session and will take care of their own layout. Like login page
  noSession?: boolean;
  // Needs session but will take care of its own layout. Like editPost
  noLayout?: boolean;
};

declare global {
  interface Window {
    dataLayer: any;
    gtag: any;
    ga: any;
    rg4js: (fn: string, params: Record<string, any>) => void;
  }
}
