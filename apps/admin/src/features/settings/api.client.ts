import { SettingInputType } from "@/__generated__/__types__";
import { UpdateOptionsMutation } from "@/__generated__/src/graphql/queries/mutations.graphql";
import {
  DeleteAuthorDocument,
  DeleteAuthorMutation,
  UpdateOptionsDocument,
} from "@/graphql/queries/mutations.graphql";

import { client } from "../../lib/urqlClient";

export const updateSetting = (change: SettingInputType) =>
  client.mutation<UpdateOptionsMutation>(UpdateOptionsDocument, {
    options: {
      ...change,
    },
  });

export const deleteAuthor = () =>
  client.mutation<DeleteAuthorMutation>(DeleteAuthorDocument, {});
