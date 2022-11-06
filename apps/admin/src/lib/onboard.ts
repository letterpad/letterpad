import bcrypt from "bcryptjs";

import {
  InputCreateAuthor,
  InputCreatePost,
  PostStatusOptions,
  PostTypes,
  SettingInputType,
} from "@/__generated__/__types__";
import { defaultSettings } from "@/graphql/db/seed/constants";
import generatePost from "@/graphql/db/seed/contentGenerator";
import { enqueueEmailAndSend } from "@/graphql/mail/enqueueEmailAndSend";
import { mapSettingToDb } from "@/graphql/resolvers/mapper";
import { EmailTemplates, ROLES } from "@/graphql/types";
import { encryptEmail } from "@/shared/clientToken";
import { textToSlug } from "@/utils/slug";

import { prisma } from "./prisma";
import siteConfig from "../../config/site.config";

export const onBoardUser = async (id: number) => {
  const newAuthor = await prisma.author.findUnique({ where: { id } });
  if (newAuthor && newAuthor.verified) {
    // create new tag for author
    const newTag = {
      name: siteConfig.default_tag,
      slug: siteConfig.default_tag,
    };

    const welcomeContent = getWelcomePost();
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

function getWelcomePost() {
  const post_cover =
    "https://images.unsplash.com/photo-1516035054744-d474c5209db5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80";

  const { html } = generatePost(PostTypes.Post);
  const title = "Welcome to Letterpad";

  const post = {
    title: "Welcome to Letterpad",
    html: html,
    excerpt:
      "You can use this space to write a small description about the topic. This will be helpful in SEO.",
    cover_image: post_cover,
    cover_image_width: 1500,
    cover_image_height: 900,
    type: PostTypes.Post,
    status: PostStatusOptions.Published,
    slug: textToSlug(title),
    createdAt: new Date(),
    publishedAt: new Date(),
    reading_time: "5 mins",
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
  rolename: ROLES = ROLES.AUTHOR,
) {
  const { token, verified = false, avatar = "", ...authorData } = data;
  const role = await prisma.role.findFirst({ where: { name: rolename } });
  if (role) {
    const newAuthor = await prisma.author.create({
      data: {
        ...authorData,
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
        password: bcrypt.hashSync(data.password, 12),
        role: {
          connect: { id: role.id },
        },
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
