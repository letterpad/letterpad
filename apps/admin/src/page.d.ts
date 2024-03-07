import { NextPage } from "next";

export type Page<P = Record<string, unknown>> = NextPage<P> & {
  // Does not need any session and will take care of their own layout. Like login page
  isMessage?: boolean;
  isPublic?: boolean;
  isLogin?: boolean;
  // Needs session but will take care of its own layout. Like editPost
  noLayout?: boolean;
};

declare global {
  interface Window {
    dataLayer: any;
    gtag: any;
    ga: any;
    rg4js: (fn: string, params: Record<string, any>) => void;
    Prism: any
  }
}
