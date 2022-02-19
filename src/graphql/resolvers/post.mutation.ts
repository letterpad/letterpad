import {
  MutationCreatePostArgs,
  MutationResolvers,
  PostStatusOptions,
  PostTypes,
  RequireFields,
} from "@/__generated__/__types__";
import reading_time from "reading-time";
import {
  slugify,
  getImageDimensions,
  setImageWidthAndHeightInHtml,
  toSlug,
} from "./helpers";
import logger from "@/shared/logger";
import { EmailTemplates } from "@/graphql/types";
import { ResolverContext } from "../context";
import { Prisma } from "@prisma/client";
import { mapPostToGraphql } from "./mapper";
import Cheerio from "cheerio";

export const slugOfUntitledPost = "untitled";

export const createPost = async (
  args: RequireFields<MutationCreatePostArgs, never>,
  { session, prisma }: ResolverContext,
) => {
  if (!args.data || !session?.user.id) {
    return {
      __typename: "PostError",
      message: "Session not found",
    };
  }

  const author = await prisma.author.findFirst({
    where: { id: session.user.id },
  });

  if (!author) {
    return {
      __typename: "PostError",
      message: "Author not found",
    };
  }

  let slug = args.data.slug;
  if (!slug) {
    const titleWithoutSpaces = toSlug(args.data.title || slugOfUntitledPost);
    slug = await slugify(prisma.post, titleWithoutSpaces);
  }
  try {
    const newPost = await prisma.post.create({
      data: {
        cover_image: args.data.cover_image?.src,
        cover_image_width: args.data.cover_image?.width,
        cover_image_height: args.data.cover_image?.height,
        html: args.data.html,
        author: {
          connect: { id: author.id },
        },
        slug,
        type: args.data.type || PostTypes.Post,
        status: args.data.status,
      },
    });

    if (newPost) {
      return {
        ...mapPostToGraphql(newPost),
        title: args.data.title || "Untitled",
      };
    }
  } catch (e) {}
  return {
    __typename: "PostError",
    message: "Unable to create post",
  };
};
const Mutation: MutationResolvers<ResolverContext> = {
  //@ts-ignore
  async createPost(_parent, args, context) {
    return await createPost(args, context);
  },

  async updatePost(_parent, args, { session, prisma, mailUtils }, _info) {
    if (!session?.user.id) {
      return {
        __typename: "PostError",
        message: "Authentication failed",
      };
    }
    try {
      if (!args.data) {
        return {
          __typename: "PostError",
          message: "No arguments to create a post",
        };
      }
      const existingPost = await prisma.post.findFirst({
        where: { id: args.data.id },
      });

      if (!existingPost) {
        return {
          __typename: "PostError",
          message: "Current post not found to update",
        };
      }

      const newPostArgs: Prisma.PostUpdateArgs = {
        data: {
          slug: await getOrCreateSlug(
            prisma.post,
            args.data.id,
            args.data.slug,
            args.data.title,
          ),
          title: args.data.title,
          excerpt: args.data.excerpt,
          status: args.data.status,
          featured: args.data.featured,
          ...(await getCoverImageAttrs(args.data.cover_image)),
          ...(await getPublishingDates(existingPost, args.data.status)),
          ...(await getContentAttrs(
            existingPost,
            args.data.html,
            args.data.status,
          )),
        },
        where: {
          id: args.data.id,
        },
      };
      if (args.data.tags) {
        newPostArgs.data.tags = {
          set: [],
          connectOrCreate: args.data.tags.map(({ name, slug }) => {
            return {
              create: { name, slug },
              where: { name },
            };
          }),
        };
      }
      const updatedPost = await prisma.post.update(newPostArgs);
      // update content

      if (updatedPost) {
        await updateMenuOnTitleChange(
          prisma.author,
          session.user.id,
          existingPost.type,
          updatedPost.title,
          updatedPost.slug,
        );
      }

      if (isPublishingLive(existingPost.status, updatedPost.status)) {
        if (mailUtils.enqueueEmailAndSend) {
          await mailUtils.enqueueEmailAndSend({
            template_id: EmailTemplates.NEW_POST,
            post_id: args.data.id,
          });
        }
      }

      if (!updatedPost) {
        return {
          __typename: "PostError",
          message: "Updated post not found",
        };
      }

      return {
        ...mapPostToGraphql(updatedPost),
      };
    } catch (e) {
      console.log(e);
      return {
        __typename: "PostError",
        message: e.message,
      };
    }
  },
};

function isPublishingLive(oldStatus: string | null, newStatus?: string | null) {
  return (
    newStatus === PostStatusOptions.Published &&
    oldStatus === PostStatusOptions.Draft
  );
}

function rePublished(prevStatus: string, currentStatus?: string | null) {
  return (
    prevStatus === PostStatusOptions.Published &&
    currentStatus === PostStatusOptions.Published
  );
}
function savingDraft(prevStatus: string, statusArg?: string) {
  if (statusArg === PostStatusOptions.Draft) return true;
  if (prevStatus === PostStatusOptions.Draft && !statusArg) return true;
  if (prevStatus === PostStatusOptions.Published && !statusArg) return true;

  return false;
}

async function updateMenuOnTitleChange(
  Author: Prisma.AuthorDelegate<false>,
  authorId: number,
  postType?: string,
  title?: string,
  slug?: string,
) {
  if (!title && !slug) return false;
  const author = await Author.findFirst({
    where: { id: authorId },
    include: { setting: true },
  });
  if (!author) return false;

  const isPage = postType === PostTypes.Page;
  const jsonMenu = JSON.parse(author.setting?.menu || "[]");
  const updatedMenu = jsonMenu.map((item) => {
    if (title) {
      if (isPage && item.type === "page") {
        item.original_name = title;
      }
    }
    if (slug) {
      if (isPage && item.type === "page") {
        item.slug = slug;
      }
    }
    return item;
  });
  await Author.update({
    data: {
      setting: {
        update: {
          menu: JSON.stringify(updatedMenu),
        },
      },
    },
    where: { id: authorId },
  });
}

async function getOrCreateSlug(
  postModel: Prisma.PostDelegate<false>,
  id: number,
  slug?: string,
  title?: string,
) {
  const existingPost = await postModel.findFirst({ where: { id } });

  if (existingPost?.slug && slug) {
    slug = slug?.replace("/post/", "").replace("/page/", "");
    slug = await slugify(postModel, slug);
    return slug;
  }

  if (title && !existingPost?.slug) {
    slug = title.replace(/ /g, "-");
    slug = await slugify(postModel, slug);
    return slug;
  }

  if (!slug) return existingPost?.slug;
  return slug;
}

async function getCoverImageAttrs(cover_image) {
  if (!cover_image) return {};
  const { width, height } = cover_image;
  let src = cover_image.src?.replace(process.env.ROOT_URL || "", "");

  const data = {
    cover_image: src,
    cover_image_width: width,
    cover_image_height: height,
  };
  if (width && height && src) {
    return data;
  }
  if (!src) return data;

  try {
    const imageSize = await getImageDimensions(src);
    data.cover_image_width = imageSize.width;
    data.cover_image_height = imageSize.height;
  } catch (e) {
    logger.error(`Failed to retrieve width and height of image - ${src}`);
  }

  return data;
}
async function getPublishingDates(
  prevPost: Prisma.PostMinAggregateOutputType,
  newStatus?: PostStatusOptions,
) {
  const { status, publishedAt } = prevPost;
  const currentTime = new Date();
  if (status && isPublishingLive(status, newStatus)) {
    if (!publishedAt) {
      return { publishedAt: currentTime, scheduledAt: null };
    }
  }
  return { updatedAt: currentTime };
}

const empty = "";

async function getContentAttrs(
  prevPost: Prisma.PostMinAggregateOutputType,
  html?: string,
  newStatus?: PostStatusOptions,
) {
  if (html) {
    const $ = Cheerio.load(html);
    $("[data-tippy-root]").remove();
    html = $.html();
  }
  const data = {
    html: html || prevPost.html || empty,
    html_draft: prevPost.html_draft || empty,
    reading_time: prevPost.reading_time || empty,
  };

  if (!prevPost.status) {
    return data;
  }
  if (savingDraft(prevPost.status, newStatus)) {
    data.html = prevPost.html || empty;
    data.html_draft = html || data.html_draft;
    return data;
  }
  if (rePublished(prevPost.status, newStatus)) {
    if (!html) {
      data.html = data.html_draft;
    }
    data.html = (await setImageWidthAndHeightInHtml(data.html)) || empty;
    data.html_draft = empty;
    data.reading_time = reading_time(data.html).text;
  }

  return data;
}

export default { Mutation };
