import { cache } from "react";

import { RegisterStep, ResolversTypes } from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";
import { getSocialLink } from "@/graphql/resolvers/helpers";
import { getRootUrl } from "@/shared/getRootUrl";

export const getAuthor = cache(
  async (
    _: any,
    { session, client_author_id, dataloaders }: ResolverContext
  ): Promise<ResolversTypes["AuthorResponse"]> => {
    const authorId = client_author_id || session?.user.id;
    if (!authorId) {
      return {
        __typename: "UnAuthorized",
        message: "Invalid Session or Token",
      };
    }
    const author = await dataloaders.author.load(authorId);
    if (author) {
      let avatar = author.avatar as string;
      if (avatar && avatar.startsWith("/")) {
        avatar = new URL(avatar, getRootUrl()).href;
      }
      return {
        ...author,
        register_step: author.register_step as RegisterStep,
        social: getSocialLink(JSON.parse(author.social as string)),
        avatar,
        createdAt: author.createdAt?.toISOString(),
        analytics_id: author.analytics_id || undefined,
        analytics_uuid: author.analytics_uuid || undefined,
        stripe_customer_id: author.stripe_customer_id || undefined,
        stripe_subscription_id: author.stripe_subscription_id || undefined,
        signature: author.signature || undefined,
        __typename: "Author",
      };
    }
    return { __typename: "NotFound", message: "Author not found" };
  }
);
