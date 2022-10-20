import { createAuthorWithSettings } from "@/lib/onboard";

import {
  MutationCreateAuthorArgs,
  RequireFields,
  ResolversTypes,
} from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";
import { enqueueEmailAndSend } from "@/graphql/mail/enqueueEmailAndSend";
import { validateCaptcha } from "@/graphql/resolvers/helpers";
import { EmailTemplates } from "@/graphql/types";

export const createAuthor = async (
  args: RequireFields<MutationCreateAuthorArgs, "data">,
  { prisma }: ResolverContext,
): Promise<ResolversTypes["AuthorResponse"]> => {
  if (args.data?.token) {
    const response = await validateCaptcha(
      process.env.RECAPTCHA_KEY_SERVER,
      args.data.token,
    );
    if (!response) {
      return {
        __typename: "Failed",
        message: "We cannot allow you at the moment.",
      };
    }
  }

  const authorExistData = await prisma.author.findFirst({
    where: { email: args.data?.email },
  });

  if (authorExistData) {
    return {
      __typename: "Failed",
      message: "Email already exist. Did you forget your password ?",
    };
  }

  const usernameExist = await prisma.author.findFirst({
    where: { username: args.data?.username },
  });

  if (usernameExist) {
    return {
      __typename: "Failed",
      message: "Username already exist",
    };
  }

  const { setting = {}, ...authorData } = args.data;

  const created = await createAuthorWithSettings(authorData, setting);
  if (created) {
    const newAuthor = await prisma.author.findUnique({
      where: { id: created.id },
    });
    if (newAuthor) {
      await enqueueEmailAndSend({
        author_id: newAuthor.id,
        template_id: EmailTemplates.VerifyNewUser,
      });
      const { id, email, username, name } = newAuthor;
      return {
        id,
        email,
        username,
        name,
        __typename: "Author",
      };
    }
  }

  return {
    __typename: "Exception",
    message: "Something went wrong and we dont know what.",
  };
};
