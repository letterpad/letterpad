import { createAuthorWithSettings } from "@/components/onboard";

import {
  MutationCreateAuthorArgs,
  RegisterStep,
  RequireFields,
  ResolversTypes,
} from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";
import { enqueueEmailAndSend } from "@/graphql/mail/enqueueEmailAndSend";
import { validateCaptcha } from "@/graphql/resolvers/helpers";
import { EmailTemplates } from "@/graphql/types";
import { isBlackListed } from "@/pages/api/auth/blacklist";
import { getHashedPassword, isPasswordValid } from "@/utils/bcrypt";

export const createAuthor = async (
  args: RequireFields<MutationCreateAuthorArgs, "data">,
  { prisma }: ResolverContext
): Promise<ResolversTypes["AuthorResponse"]> => {
  if (isBlackListed(args.data?.email)) {
    return Promise.reject(new Error("Your email domain has been blacklisted."));
  }
  if (args.data?.token) {
    const response = await validateCaptcha(
      process.env.RECAPTCHA_KEY_SERVER,
      args.data.token
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
    const validated = await isPasswordValid(
      args.data?.password || "",
      authorExistData.password
    );
    if (validated) {
      if (
        authorExistData.register_step === RegisterStep.ProfileInfo ||
        authorExistData.register_step === RegisterStep.SiteInfo
      ) {
        const { id, email, username, name, register_step, verified } =
          authorExistData;
        return {
          id,
          email,
          username,
          name,
          register_step,
          verified,
          __typename: "Author",
        };
      }
    }

    return {
      __typename: "Failed",
      message: "Email already exist. Did you forget your password ?",
    };
  }

  const { setting = {}, ...authorData } = args.data;
  if (authorData.password) {
    authorData.password = await getHashedPassword(authorData.password);
  }

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
        register_step: (created.register_step ??
          RegisterStep.ProfileInfo) as RegisterStep,
        __typename: "Author",
      };
    }
  }

  return {
    __typename: "Exception",
    message: "Something went wrong and we dont know what.",
  };
};
