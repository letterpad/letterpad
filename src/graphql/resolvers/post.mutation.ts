import {
  MutationCreatePostArgs,
  MutationResolvers,
  Navigation,
  NavigationType,
  PostStatusOptions,
  PostTypes,
  RequireFields,
} from "@/__generated__/__types__";
import {
  slugify,
  getImageDimensions,
  setImageWidthAndHeightInHtml,
  getReadingTimeFromHtml,
} from "./helpers";
import logger from "@/shared/logger";
// import { EmailTemplates } from "@/graphql/types";
import { ResolverContext } from "../context";
import { Prisma } from "@prisma/client";
import { mapPostToGraphql } from "./mapper";
import Cheerio from "cheerio";
import { getLastPartFromPath, textToSlug } from "@/utils/slug";

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

  try {
    const newPost = await prisma.post.create({
      data: {
        title: args.data.title,
        cover_image: args.data.cover_image?.src,
        cover_image_width: args.data.cover_image?.width,
        cover_image_height: args.data.cover_image?.height,
        html: args.data.html || "",
        author: {
          connect: { id: author.id },
        },
        type: args.data.type || PostTypes.Post,
        status: args.data.status,
      },
    });
    const newSlug = await getOrCreateSlug(
      prisma.post,
      newPost.id,
      slug,
      args.data.title,
    );
    await prisma.post.update({
      data: { slug: newSlug },
      where: { id: newPost.id },
    });
    newPost.slug = newSlug;
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

  async updatePost(_parent, args, { session, prisma }, _info) {
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
        await updateMenuOnTitleChange({
          Author: prisma.author,
          authorId: session.user.id,
          isPage: updatedPost.type === PostTypes.Page,
          prevOriginalName: existingPost.title,
          originalName: updatedPost.title,
          slug: updatedPost.slug,
        });
      }

      // if (isPublishingLive(existingPost.status, updatedPost.status)) {
      //   if (mailUtils.enqueueEmailAndSend) {
      //     await mailUtils.enqueueEmailAndSend({
      //       template_id: EmailTemplates.NEW_POST,
      //       post_id: args.data.id,
      //     });
      //   }
      // }

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

function isPublishingLive(newStatus: string | null, oldStatus?: string | null) {
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

interface UpdateMenuProps {
  Author: Prisma.AuthorDelegate<false>;
  authorId: number;
  isPage: boolean;
  slug: string;
  originalName?: string;
  prevOriginalName: string;
}
async function updateMenuOnTitleChange(props: UpdateMenuProps) {
  const { Author, isPage, prevOriginalName, originalName, authorId, slug } =
    props;

  if (isPage) {
    const author = await Author.findFirst({
      where: { id: authorId },
      include: { setting: true },
    });
    if (!author) return false;
    const jsonMenu = JSON.parse(author.setting?.menu || "[]") as Navigation[];

    const updatedMenu = jsonMenu.map((item) => {
      if (
        item.type === NavigationType.Page &&
        item.original_name === prevOriginalName
      ) {
        if (originalName) item.original_name = originalName;
        item.slug = slug;
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
}

async function getOrCreateSlug(
  postModel: Prisma.PostDelegate<false>,
  id: number,
  newSlug?: string,
  newTitle?: string,
) {
  const existingPost = await postModel.findFirst({ where: { id } });

  if (!existingPost) return "";
  // slug already exist for this post, but user updated the slug
  if (existingPost?.slug && newSlug) {
    newSlug = getLastPartFromPath(newSlug);
    newSlug = await slugify(
      postModel,
      textToSlug(newSlug),
      existingPost.author_id,
    );
    return newSlug;
  }

  // slug does not exist for existing post or contains default untitled slug.
  // If new title was entered, create a new slug
  if (
    newTitle &&
    (existingPost?.slug.startsWith("untitled") || !existingPost?.slug)
  ) {
    newSlug = await slugify(
      postModel,
      textToSlug(newTitle),
      existingPost.author_id,
    );
    return newSlug;
  }

  if (!existingPost.title && !newTitle && !newSlug) {
    newSlug = await slugify(postModel, "untitled", existingPost.author_id);
    return newSlug;
  }

  if (!newSlug) return existingPost?.slug;

  return textToSlug(newSlug);
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
    // remove all tooltips which are used for grammar checking
    $("[data-tippy-root]").remove();
    $("head").remove();
    $(".mark").each(function () {
      // remove all decorations caused by grammar
      $(this).replaceWith($(this).text());
    });
    html = $.html();
  }

  if (!prevPost.status) {
    return {
      html_draft: html,
    };
  }
  if (savingDraft(prevPost.status, newStatus)) {
    const _html = html || prevPost.html_draft || empty;
    return {
      html_draft: _html,
      reading_time: getReadingTimeFromHtml(_html),
    };
  }
  if (newStatus && isPublishingLive(newStatus, prevPost.status)) {
    const _html = html || prevPost.html || prevPost.html_draft || empty;
    return {
      reading_time: getReadingTimeFromHtml(_html),
      html_draft: empty,
      html: _html,
    };
  }
  if (rePublished(prevPost.status, newStatus)) {
    const _html = html || prevPost.html_draft || prevPost.html || empty;
    return {
      html_draft: "",
      html: await setImageWidthAndHeightInHtml(_html),
      reading_time: getReadingTimeFromHtml(_html),
    };
  }
  return {};
}

export default { Mutation };
