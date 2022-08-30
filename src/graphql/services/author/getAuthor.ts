import { ResolversTypes } from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";
import { getSocialLink } from "@/graphql/resolvers/helpers";

export const getAuthor = async (
  _: any,
  { session, prisma, client_author_id }: ResolverContext,
): Promise<ResolversTypes["AuthorResponse"]> => {
  client_author_id = session?.user.id || client_author_id;

  if (!client_author_id) {
    return {
      __typename: "UnAuthorized",
      message: "Invalid Session or Token",
    };
  }
  const author = await prisma.author.findFirst({
    where: {
      id: client_author_id,
    },
  });
  if (author) {
    let avatar = author.avatar as string;
    if (avatar && avatar.startsWith("/")) {
      avatar = new URL(avatar, process.env.ROOT_URL).href;
    }

    return {
      ...author,
      social: getSocialLink(JSON.parse(author.social as string)),
      avatar,
      analytics_id: author.analytics_id || undefined,
      analytics_uuid: author.analytics_uuid || undefined,
      __typename: "Author",
    };
  }
  return { __typename: "NotFound", message: "Author not found" };
};
