import { useClient, useQuery } from "urql";

import { SettingInputType } from "@/__generated__/__types__";
import { UpdateOptionsMutation } from "@/__generated__/src/graphql/queries/mutations.graphql";
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
  client.mutation<UpdateOptionsMutation>(UpdateOptionsDocument, {
    options: {
      ...change,
    },
  });

export const deleteAuthor = () =>
  client.mutation<DeleteAuthorMutation>(DeleteAuthorDocument, {});

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
