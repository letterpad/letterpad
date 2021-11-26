import { getApolloClient } from "@/graphql/apollo";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";

import { useState, useEffect } from "react";

export const useApolloClient = () => {
  const [apolloClient, setClient] =
    useState<ApolloClient<NormalizedCacheObject>>();

  useEffect(() => {
    getApolloClient().then((data) => {
      setClient(data);
    });
  }, []);

  return apolloClient;
};
