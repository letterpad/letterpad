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
import { textToSlug } from "@/utils/slug";

export const onBoardUser = async (id: number) => {
  const newAuthor = await prisma.author.findUnique({ where: { id } });
  if (newAuthor && newAuthor.verified) {
    // create new tag for author
    const newTag = {
      name: siteConfig.default_tag,
      slug: siteConfig.default_tag,
    };

    const welcomeContent = getWelcomePost(newAuthor.name);
    await prisma.post.create({
      data: {
        ...welcomeContent.post,
        author: {
          connect: { id: newAuthor.id },
        },
        tags: {
          connectOrCreate: {
            create: { name: newTag.name },
            where: { name: newTag.name },
          },
        },
      },
    });

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

function getWelcomePost(name: string) {
  const post_cover =
    "https://images.unsplash.com/photo-1625992865747-d814b125ab22?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2970&q=80";

  const html = `This is ${name}. I am starting a brand new site and I am excited to see how this goes. Please visit me after few days to see what I have written or subscribe to my newsletter to get notified when I publish a new post.`;
  const title = "Coming Soon";

  const excerpt = `This is ${name}. I am starting a brand new site and I am excited to see how this goes.`;
  const post = {
    title,
    html: html,
    excerpt,
    cover_image: post_cover,
    cover_image_width: 1500,
    cover_image_height: 900,
    type: PostTypes.Post,
    status: PostStatusOptions.Published,
    slug: textToSlug(title),
    createdAt: new Date(),
    publishedAt: new Date(),
    reading_time: "1 min",
    stats: JSON.stringify({
      words: html.split(" ").length,
      reading_time: 1,
      characters: html.length,
      spaceless_characters: html.split(" ").length - 30,
    }),
    page_data: JSON.stringify({ rows: [] }),
    page_type: "default",
  };

  return { post };
}

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
    token: _token,
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
