import {
  SettingInputType, UpdateOptionsMutation,
  UpdateOptionsMutationVariables,
} from "letterpad-graphql";
import {
  useSettingsQuery, useUpdateOptionsMutation
} from "letterpad-graphql/dist/hooks";

import { client } from "@/lib/urqlClient";

import {
  DeleteAuthorDocument,
  DeleteAuthorMutation,
  UpdateOptionsDocument,
} from "@/graphql/queries/mutations.graphql";
import { isSettings } from "@/utils/type-guards";

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
  const [{ error, fetching }, updateSettings] = useUpdateOptionsMutation();

  return {
    updateSettings,
    error,
    fetching,
  };
};
export const useGetSettings = () => {
  const [{ data, fetching }] = useSettingsQuery();
  const settings = isSettings(data?.settings) ? data?.settings : undefined;

  return {
    data: settings,
    fetching,
  };
};
