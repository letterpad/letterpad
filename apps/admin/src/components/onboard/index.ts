import { prisma } from "@/lib/prisma";

import {
  InputCreateAuthor,
  PostStatusOptions,
  PostTypes,
  RegisterStep,
  SettingInputType,
} from "@/__generated__/__types__";
import siteConfig from "@/config/site.config";
import { defaultSettings } from "@/graphql/db/seed/constants";
import { enqueueEmailAndSend } from "@/graphql/mail/enqueueEmailAndSend";
import { mapSettingToDb } from "@/graphql/resolvers/mapper";
import { EmailTemplates, ROLES } from "@/graphql/types";
import { encryptEmail } from "@/shared/clientToken";

export const onBoardUser = async (id: number) => {
  const newAuthor = await prisma.author.findUnique({ where: { id } });
  if (newAuthor && newAuthor.verified) {
    await enqueueEmailAndSend({
      author_id: newAuthor.id,
      template_id: EmailTemplates.WelcomeUser,
    });

    const { id, email, username, name } = newAuthor;
    return {
      __typename: "Author",
      id,
      email,
      username,
      name,
    };
  }
};

export async function createAuthorWithSettings(
  data: InputCreateAuthor & {
    verified?: boolean;
    login_type?: string;
    avatar?: string;
  },
  setting: SettingInputType,
  rolename: ROLES = ROLES.AUTHOR
) {
  const {
    token,
    verified = false,
    avatar = "https://res.cloudinary.com/abhisheksaha/image/upload/v1672944041/blog-images/6611482_account_avatar_basic_person_user_icon_eisadm.png",
    ...authorData
  } = data;

  const role = await prisma.role.findFirst({ where: { name: rolename } });
  if (role) {
    const newAuthor = await prisma.author.create({
      data: {
        name: "",
        register_step: RegisterStep.ProfileInfo,
        ...authorData,
        username:
          authorData.username ?? generateUsernameFromEmail(authorData.email),
        avatar,
        verified,
        bio: "",
        occupation: "",
        stripe_customer_id: "",
        stripe_subscription_id: "",
        company_name: "",
        social: JSON.stringify({
          twitter: "",
          facebook: "",
          github: "",
          instagram: "",
        }),
        password: data.password,
        role: {
          connect: { id: role.id },
        },
        signature: "",
        setting: {
          create: {
            ...defaultSettings,
            ...mapSettingToDb(setting),
            site_url: `https://${authorData.username}.letterpad.app`,
            client_token: encryptEmail(authorData.email),
          },
        },
      },
    });

    return newAuthor;
  }
}

function generateUsernameFromEmail(email: string) {
  const hashedEmail = btoa(
    decodeURIComponent(encodeURIComponent(randomizeString(email)))
  );
  // Take the first 6 characters of the hash
  const shortHash = hashedEmail.substring(0, 6).toLowerCase();

  return shortHash;
}

function randomizeString(str: string) {
  return str
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("")
    .replace(/[^a-zA-Z0-9]/g, "");
}
