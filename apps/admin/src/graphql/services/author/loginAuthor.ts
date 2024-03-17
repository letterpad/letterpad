import { LoginResponse, MutationLoginArgs } from "letterpad-graphql";

import { ResolverContext } from "@/graphql/context";
import { mapAuthorToGraphql } from "@/graphql/resolvers/mapper";
import { isPasswordValid } from "@/utils/bcrypt";

export const loginAuthor = async (
  args: MutationLoginArgs,
  { prisma }: ResolverContext
): Promise<LoginResponse> => {
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
    const authenticated = await isPasswordValid(
      args.data?.password || "",
      author.password
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
