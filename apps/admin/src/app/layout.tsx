// "use client";
// import { ApolloProvider } from "@apollo/client";
import Head from "next/head";
import Script from "next/script";
import { SessionProvider, useSession } from "next-auth/react";
import React, { useMemo } from "react";
import { ResponsiveProvider } from "ui";

import "ui/css/tailwind.css";
import "../../public/css/globals.css";
import "../../public/css/theme-variables.css";
import "ui/css/editor.css";
import "../../public/website/css/style.css";

import { basePath, gaTrackingId } from "../constants";
import { DataContext } from "../context/DataProvider";
import { apolloBrowserClient } from "../graphql/apolloBrowserClient";
import { useHomeQueryQuery } from "../graphql/queries/queries.graphql";
import { useSavingIndicator } from "../hooks/useSavingIndicator";
import { getServerSession } from "next-auth";
import { options } from "../pages/api/auth/[...nextauth]";

const RootLayout = async ({ children, params }) => {
  // const Indicator = useSavingIndicator();
  const a = await getServerSession();
  console.log(a)
  return (
    <html>
      <Head>
        <link rel="stylesheet" href={basePath + "/css/theme-variables.css"} />
        <script src={basePath + `/prism/prism.js`} async />
      </Head>
      <body className="font-inter text-base tracking-tight antialiased dark:bg-gray-900 dark:text-gray-100">
        {/* <SessionProvider basePath={basePath + "/api/auth"}> */}
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`}
          />
          <Script id="google-analytics" async={true}>
            {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', '${gaTrackingId}');
        `}
          </Script>xxxx
          {/* <ApolloProvider client={apolloBrowserClient}> */}
          {/* {Indicator} */}
          {/* <ResponsiveProvider>
              <div id="message" />
              <DataProvider>{children}</DataProvider>
              <div id="modal-root" />
            </ResponsiveProvider> */}
          {/* </ApolloProvider> */}
        {/* </SessionProvider> */}
      </body>
    </html>
  );
};

export default RootLayout;

// const DataProvider = ({ children }) => {
//   const { data: session } = useSession();
//   const { data, loading, refetch } = useHomeQueryQuery({
//     skip: !session?.user?.id,
//   });

//   const value = useMemo(() => {
//     return { ...data, session };
//   }, [data, session]);

//   return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
// };
