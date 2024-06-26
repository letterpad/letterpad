import { AuthorResponse, RegisterStep } from "letterpad-graphql";
import { cache } from "react";

import { ResolverContext } from "@/graphql/context";
import { getSocialLink } from "@/graphql/resolvers/helpers";
import { getRootUrl } from "@/shared/getRootUrl";

export const getAuthor = cache(
  async (
    authorId: string | undefined,
    { dataloaders }: ResolverContext
  ): Promise<AuthorResponse> => {
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
        signature: author.signature || undefined,
        __typename: "Author",
      };
    }
    return { __typename: "NotFound", message: "Author not found" };
  }
);
