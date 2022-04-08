import siteConfig from "../../config/site.config";
import bcrypt from "bcryptjs";
import generatePost from "@/graphql/db/seed/contentGenerator";
import { encryptEmail } from "@/shared/clientToken";
import { EmailTemplates, ROLES } from "@/graphql/types";
import {
  InputCreateAuthor,
  PostStatusOptions,
  PostTypes,
  SettingInputType,
} from "@/__generated__/__types__";
import { prisma } from "./prisma";
import { mapSettingToDb } from "@/graphql/resolvers/mapper";
import { defaultSettings } from "@/graphql/db/seed/constants";
import { textToSlug } from "@/utils/slug";
import { enqueueEmailAndSend } from "@/graphql/mail/enqueueEmailAndSend";

export const onBoardUser = async (id: number) => {
  const newAuthor = await prisma.author.findUnique({ where: { id } });
  if (newAuthor && newAuthor.verified) {
    // create new tag for author
    const newTag = {
      name: siteConfig.first_post_tag,
      slug: siteConfig.first_post_tag,
    };

    const welcomeContent = getWelcomePostAndPage();
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

    await prisma.post.create({
      data: {
        ...welcomeContent.page,
        author: {
          connect: { id: newAuthor.id },
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

function getWelcomePostAndPage() {
  const post_cover =
    "https://images.unsplash.com/photo-1516035054744-d474c5209db5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80";

  let { html } = generatePost(PostTypes.Post);
  let title = "Welcome to Letterpad";

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
  };

  const pageContent = generatePost(PostTypes.Page);
  title = "Letterpad Typography";

  const page = {
    title,
    type: PostTypes.Page,
    html: pageContent.html,
    status: PostStatusOptions.Published,
    excerpt:
      "You can use this space to write a small description about this page. This will be helpful in SEO.",
    slug: textToSlug(title),
    cover_image:
      "https://images.unsplash.com/photo-1505682634904-d7c8d95cdc50?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
    cover_image_width: 1482,
    cover_image_height: 900,
    createdAt: new Date(),
    publishedAt: new Date(),
    html_draft: "",
  };

  return { page, post };
}

export async function createAuthorWithSettings(
  data: InputCreateAuthor & { verified?: boolean },
  setting: SettingInputType,
  rolename: ROLES = ROLES.AUTHOR,
) {
  const { token, verified = false, ...authorData } = data;
  const role = await prisma.role.findFirst({ where: { name: rolename } });
  if (role) {
    const newAuthor = await prisma.author.create({
      data: {
        ...authorData,
        avatar: "",
        verified,
        bio: "",
        occupation: "",
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
