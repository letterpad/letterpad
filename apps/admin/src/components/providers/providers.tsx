"use client";

import { SessionProvider } from "next-auth/react";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { ResponsiveProvider } from "ui";
import { Provider as UrqlProvider } from "urql";

import { basePath } from "../../constants";
import { useSavingIndicator } from "../../hooks/useSavingIndicator";
import { client } from "../../lib/urqlClient";
export const Providers = ({ children, loggedIn }) => {
  const Indicator = useSavingIndicator();

  return (
    <SessionProvider basePath={basePath + "/api/auth"}>
      <UrqlProvider value={client}>
        {Indicator}
        <ResponsiveProvider>
          <div id="message" />
          {children}
          <ProgressBar
            height="3px"
            color="#2fb2fa"
            options={{ showSpinner: false }}
            shallowRouting
          />
          <div id="modal-root" />
        </ResponsiveProvider>
      </UrqlProvider>
    </SessionProvider>
  );
};
