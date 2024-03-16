import { SettingResponse } from "letterpad-graphql";
import { cache } from "react";

import { ResolverContext } from "@/graphql/context";
import { mapSettingToGraphql } from "@/graphql/resolvers/mapper";

export const getSetting = cache(
  async (
    _args: unknown,
    { session, client_author_id, dataloaders }: ResolverContext
  ): Promise<SettingResponse> => {
    const authorId = session?.user.id || client_author_id;

    if (authorId) {
      const author = await dataloaders.author.load(authorId);
      const setting = await dataloaders.setting.load(authorId);
      const authorWithSetting = {
        ...author,
        setting,
      };
      if (authorWithSetting.setting) {
        return { ...mapSettingToGraphql(authorWithSetting.setting) };
      }
    }

    return {
      __typename: "UnAuthorized",
      message: `Setting related to author:${authorId} not found`,
    };
  }
);
