import { SettingResponse } from "letterpad-graphql";
import { cache } from "react";

import { ResolverContext } from "@/graphql/context";
import { mapSettingToGraphql } from "@/graphql/resolvers/mapper";
import { ensureAuthorSetting } from "./ensureSetting";

export const getSetting = cache(
  async (
    _args: unknown,
    { session, client_author_id }: ResolverContext
  ): Promise<SettingResponse> => {
    const authorId = session?.user.id || client_author_id;

    if (authorId) {
      const setting = await ensureAuthorSetting(authorId);
      if (setting) {
        return { ...mapSettingToGraphql(setting) };
      }
    }

    return {
      __typename: "UnAuthorized",
      message: `Setting related to author:${authorId} not found`,
    };
  }
);
