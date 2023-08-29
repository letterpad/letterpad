import { cacheExchange } from "@urql/exchange-graphcache";
import { useClient, useMutation, useQuery } from "urql";

import { SettingInputType } from "@/__generated__/__types__";
import {
  UpdateAuthorMutationVariables,
  UpdateOptionsMutation,
  UpdateOptionsMutationVariables,
} from "@/__generated__/src/graphql/queries/mutations.graphql";
import {
  DeleteAuthorDocument,
  DeleteAuthorMutation,
  UpdateOptionsDocument,
} from "@/graphql/queries/mutations.graphql";

import { client } from "../../lib/urqlClient";
import { isSettings } from "../../utils/type-guards";
import {
  SettingsDocument,
  SettingsQuery,
} from "../../../__generated__/src/graphql/queries/queries.graphql";

export const updateSetting = (change: SettingInputType) =>
  client.mutation<UpdateOptionsMutation, UpdateOptionsMutationVariables>(
    UpdateOptionsDocument,
    {
      options: {
        ...change,
      },
    },
    {
      optimistic: true,
    }
  );

export const deleteAuthor = () =>
  client.mutation<DeleteAuthorMutation>(DeleteAuthorDocument, {});

export const useUpdateSettings = () => {
  const [{ data, error, fetching }, updateSettings] = useMutation<
    UpdateOptionsMutation,
    UpdateOptionsMutationVariables
  >(UpdateOptionsDocument);

  return {
    updateSettings,
    error,
    fetching,
  };
};
export const useGetSettings = () => {
  const [{ data, error, fetching }] = useQuery<SettingsQuery>({
    query: SettingsDocument,
  });
  const settings = isSettings(data?.settings) ? data?.settings : undefined;

  return {
    data: settings,
    fetching,
  };
};
