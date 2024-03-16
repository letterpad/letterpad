import {
  QueryTagArgs,
  TagResponse,
  TagType,
} from "graphql-letterpad";
import { cache } from "react";

import { ResolverContext } from "@/graphql/context";

export const getTag = cache(
  async (
    args: QueryTagArgs,
    { session, client_author_id, prisma }: ResolverContext
  ): Promise<TagResponse> => {
    const authorId = session?.user.id || client_author_id;

    if (!authorId) {
      return {
        __typename: "Exception",
        message: "You dont have access to get this resource",
      };
    }

    const tag = await prisma.tag.findFirst({
      where: { slug: args.slug },
    });

    if (tag) {
      return {
        __typename: "Tag",
        ...tag!,
        slug: tag.slug!,
        type: TagType.Tag,
        name: tag.name,
        id: tag.name,
      };
    }
    return {
      __typename: "Exception",
      message: "Tag not found",
    };
  }
);
