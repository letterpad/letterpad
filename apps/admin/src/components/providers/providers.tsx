"use client";

import { ApolloProvider } from "@apollo/client";
import { SessionProvider } from "next-auth/react";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { ResponsiveProvider } from "ui";
import { Provider as UrqlProvider } from "urql";

// import { SettingsAndMeProvider } from "./settings";
import { basePath } from "../../constants";
import { apolloBrowserClient } from "../../graphql/apolloBrowserClient";
import { useSavingIndicator } from "../../hooks/useSavingIndicator";
import { client } from "../../lib/urqlClient";
export const Providers = ({ children, loggedIn }) => {
  const Indicator = useSavingIndicator();

  return (
    <SessionProvider basePath={basePath + "/api/auth"}>
      <UrqlProvider value={client}>
        <ApolloProvider client={apolloBrowserClient}>
          {Indicator}
          <ResponsiveProvider>
            <div id="message" />
            {/* <SettingsAndMeProvider loggedIn={loggedIn}> */}
            {children}
            {/* </SettingsAndMeProvider> */}
            <ProgressBar
              height="3px"
              color="#2fb2fa"
              options={{ showSpinner: false }}
              shallowRouting
            />
            <div id="modal-root" />
          </ResponsiveProvider>
        </ApolloProvider>
      </UrqlProvider>
    </SessionProvider>
  );
};
