import bcrypt from "bcryptjs";

import { onBoardUser } from "@/lib/onboard";

import {
  InputAuthor,
  MutationUpdateAuthorArgs,
  RegisterStep,
  RequireFields,
  ResolversTypes,
} from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";
import { enqueueEmailAndSend } from "@/graphql/mail/enqueueEmailAndSend";
import { mapAuthorToGraphql } from "@/graphql/resolvers/mapper";
import { EmailTemplates } from "@/graphql/types";
import { encryptEmail } from "@/shared/clientToken";
import { sanitizeUsername } from "@/shared/utils";

interface InputAuthorForDb extends Omit<InputAuthor, "social"> {
  social: string;
}

export const updateAuthor = async (
  args: RequireFields<MutationUpdateAuthorArgs, "author">,
  { prisma, session }: ResolverContext
): Promise<ResolversTypes["AuthorResponse"]> => {
  if (!session?.user.id) {
    return {
      __typename: "UnAuthorized",
      message: "You are not authorized to update this author",
    };
  }
  const exisitingAuthor = await prisma.author.findFirst({
    where: {
      id: session.user.id,
    },
  });
  try {
    const dataToUpdate = { ...args.author } as InputAuthorForDb & {
      verified?: boolean;
    };
    const newEmail =
      args.author.email && session.user.email !== args.author.email;

    if (args.author.password) {
      dataToUpdate.password = await bcrypt.hash(args.author.password, 12);
    }
    if (args.author.social) {
      dataToUpdate.social = JSON.stringify(args.author.social);
    }

    if (args.author.username) {
      if (!sanitizeUsername(args.author.username)) {
        return {
          __typename: "Failed",
          message: "Username is not valid",
        };
      }
      const usernameExist = await prisma.author.findFirst({
        where: {
          username: args.author.username,
          id: {
            not: {
              equals: args.author.id,
            },
          },
        },
      });

      if (usernameExist) {
        return {
          __typename: "Failed",
          message: "Username already exist",
        };
      }
    }

    if (newEmail) {
      const emailExist = await prisma.author.findFirst({
        where: {
          email: args.author.email,
          id: {
            not: {
              equals: args.author.id,
            },
          },
        },
      });

      if (emailExist) {
        return {
          __typename: "Failed",
          message: "Email already exist",
        };
      }
      dataToUpdate.verified = false;
    }

    const author = await prisma.author.update({
      data: dataToUpdate,
      where: { id: args.author.id },
    });

    //@todo:the date difference is to make sure users dont receive another email.
    // remove this after 2023-06-06
    if (
      dataToUpdate.register_step === RegisterStep.Registered &&
      exisitingAuthor?.createdAt &&
      Date.parse(exisitingAuthor.createdAt.toDateString()) >=
        Date.parse("2023-01-06")
    ) {
      onBoardUser(author.id);
    }

    if (newEmail) {
      await enqueueEmailAndSend({
        template_id: EmailTemplates.VerifyChangedEmail,
        author_id: author.id,
      });

      await prisma.setting.update({
        data: {
          client_token: encryptEmail(args.author.email as string),
        },
        where: {
          author_id: args.author.id,
        },
      });
    }
    if (args.author.username) {
      await prisma.setting.update({
        data: {
          site_url: `https://${args.author.username}.letterpad.app`,
        },
        where: {
          author_id: author.id,
        },
      });
    }
    return {
      __typename: "Author",
      ...mapAuthorToGraphql(author),
    };
  } catch (e: any) {
    return {
      __typename: "Exception",
      message: "Something wrong happened",
    };
  }
};
