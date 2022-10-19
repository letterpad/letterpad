import bcrypt from "bcryptjs";

import { MutationLoginArgs, ResolversTypes } from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";
import { mapAuthorToGraphql } from "@/graphql/resolvers/mapper";

export const loginAuthor = async (
  args: MutationLoginArgs,
  { prisma }: ResolverContext,
): Promise<ResolversTypes["LoginResponse"]> => {
  const author = await prisma.author.findFirst({
    where: { email: args.data?.email },
  });
  if (author) {
    if (!author?.verified) {
      return {
        __typename: "LoginError",
        message: "Your email id is not verified yet.",
      };
    }
    const authenticated = await bcrypt.compare(
      args.data?.password || "",
      author.password,
    );

    if (!authenticated) {
      return {
        __typename: "LoginError",
        message: "Incorrect credentials",
      };
    }

    return {
      ...mapAuthorToGraphql(author),
    };
  }
  return {
    __typename: "LoginError",
    message: "Incorrect email id",
  };
};
