import {
  SettingInputType,
  UpdateOptionsMutation,
  UpdateOptionsMutationVariables,
} from "letterpad-graphql";
import {
  useSettingsQuery,
  useUpdateOptionsMutation,
} from "letterpad-graphql/hooks";

import { client } from "@/lib/urqlClient";

import { UpdateOptionsDocument } from "@/graphql/queries/mutations.graphql";
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

export const useUpdateSettings = () => {
  const [{ error, fetching }, updateSettings] = useUpdateOptionsMutation();

  return {
    updateSettings,
    error,
    fetching,
  };
};
export const useGetSettings = (addSettings = true) => {
  const [{ data, fetching }] = useSettingsQuery({ pause: !addSettings });
  const settings = isSettings(data?.settings) ? data?.settings : undefined;

  return {
    data: settings,
    fetching,
  };
};
