import {
  AuthorResponse,
  InputAuthor,
  MutationUpdateAuthorArgs,
  RegisterStep,
  Role,
} from "graphql-letterpad/dist/graphql";

import { onBoardUser } from "@/components/onboard";

import { ResolverContext } from "@/graphql/context";
import { enqueueEmailAndSend } from "@/graphql/mail/enqueueEmailAndSend";
import { mapAuthorToGraphql } from "@/graphql/resolvers/mapper";
import { EmailTemplates } from "@/graphql/types";
import { sanitizeUsername } from "@/shared/utils";
import { getHashedPassword } from "@/utils/bcrypt";

import { getRootUrl } from "../../../shared/getRootUrl";

interface InputAuthorForDb extends Omit<InputAuthor, "social"> {
  social: string;
}

const hostname = new URL(getRootUrl()).hostname;

export const updateAuthor = async (
  args: MutationUpdateAuthorArgs,
  { prisma, session }: ResolverContext
): Promise<AuthorResponse> => {
  if (!session?.user.id) {
    return {
      __typename: "UnAuthorized",
      message: "You are not authorized to update this author",
    };
  }
  const isFavourite = session.user.role === Role.Admin && typeof args.author.favourite !== "undefined";

  const exisitingAuthor = await prisma.author.findFirst({
    where: {
      id: session.user.id,
    },
    include: {
      setting: true,
    },
  });

  if (exisitingAuthor && isFavourite) {
    await prisma.author.update({
      where: {
        id: args.author.id,
      },
      data: {
        favourite: args.author.favourite
      }
    })
    return {
      __typename: "Author",
      ...mapAuthorToGraphql({ ...exisitingAuthor, favourite: args.author.favourite! }),
    };
  }
  try {
    const dataToUpdate = { ...args.author } as InputAuthorForDb & {
      verified?: boolean;
    };
    const newEmail =
      args.author.email && session.user.email !== args.author.email;

    if (args.author.password) {
      dataToUpdate.password = await getHashedPassword(args.author.password);
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
              equals: session.user.id,
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
              equals: session.user.id,
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
    const { id: _id, ...data } = dataToUpdate;
    const author = await prisma.author.update({
      data: { ...data },
      where: { id: session.user.id },
    });

    //@todo:the date difference is to make sure users dont receive another email.
    // remove this after 2023-06-06
    if (
      dataToUpdate.register_step === RegisterStep.Registered &&
      exisitingAuthor?.createdAt
    ) {
      await onBoardUser(author.id);
    }

    if (newEmail) {
      await enqueueEmailAndSend({
        template_id: EmailTemplates.VerifyChangedEmail,
        author_id: author.id,
      });
    }
    if (
      args.author.username &&
      exisitingAuthor?.setting?.site_url.includes(hostname)
    ) {
      await prisma.setting.update({
        data: {
          site_url: `https://${args.author.username}.${hostname}`,
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
