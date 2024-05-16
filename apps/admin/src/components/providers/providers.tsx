"use client";

import { SessionProvider } from "next-auth/react";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { ResponsiveProvider, ThemeProvider } from "ui/dist/index.mjs";
import { Provider as UrqlProvider } from "urql";

// import { CSPostHogProvider } from "./posthog";
import { GetProModalProvider } from "../get-pro-modal-provider";
import { basePath } from "../../constants";
import { client } from "../../lib/urqlClient";

export const Providers = ({ children, theme }) => {
  return (
    <SessionProvider basePath={basePath + "/api/auth"}>
      {/* <CSPostHogProvider> */}
      <ThemeProvider theme={theme}>
        <ResponsiveProvider>
          <div id="message" />
          <GetProModalProvider>
            <UrqlProvider value={client}>{children}</UrqlProvider>
          </GetProModalProvider>
          <ProgressBar
            height="3px"
            color="#2fb2fa"
            options={{ showSpinner: false }}
            shallowRouting
          />
          <div id="modal-root" />
        </ResponsiveProvider>
      </ThemeProvider>
      {/* </CSPostHogProvider> */}
    </SessionProvider>
  );
};
