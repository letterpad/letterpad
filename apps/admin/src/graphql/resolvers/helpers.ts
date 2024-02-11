import { Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { load } from "cheerio";

import { Social } from "@/__generated__/__types__";
import logger from "@/shared/logger";
import { textToSlug } from "@/utils/slug";

const slugOfUntitledPost = "untitled";

export async function slugify(
  PostModel: Prisma.PostDelegate<DefaultArgs>,
  slug: string = slugOfUntitledPost,
  author_id: number,
  postId: number
): Promise<string> {
  slug = textToSlug(slug);
  const result = await PostModel.findFirst({
    where: {
      slug: slug,
      author: { id: author_id },
      id: {
        not: {
          equals: postId,
        },
      },
    },
  });
  if (result === null) {
    return slug;
  }
  let count = 1;
  slug += "-";

  async function recursiveFindUniqueSlug() {
    const result = await PostModel.findFirst({
      where: {
        slug: slug + count,
        author: { id: author_id },
        id: {
          not: {
            equals: postId,
          },
        },
      },
    });

    if (result === null) {
      return slug + count;
    }
    count++;
    return recursiveFindUniqueSlug();
  }

  return recursiveFindUniqueSlug();
}

export async function getImageDimensions(
  url: string
): Promise<{ width: number; height: number; type: string }> {
  const req = await fetch(process.env.ROOT_URL + "/api/imageSize?url=" + url);
  const data = await req.json();
  return data;
}

export const setImageWidthAndHeightInHtml = async (html: string) => {
  try {
    const $ = load(html, {
      xmlMode: true,
      decodeEntities: false,
      //@ts-ignore
      normalizeWhitespace: false,
    });
    logger.debug("Setting image width and height inside html");
    const $bodyImages = $("img");

    for (let i = 0; i < $bodyImages.length; i++) {
      const el = $bodyImages[i];
      const $el = $(el);
      $el.attr("loading", "lazy");
      $el.removeAttr("class");
      const src = $el.attr("src");
      if (!src) return $.html();
      if (!src.startsWith("http")) return $.html();
      if (!$el.attr("width") || !$el.attr("height")) {
        logger.debug("Getting dimensions of ", src);
        const size = await getImageDimensions(src);
        $el.attr("height", size.height.toString());
        $el.attr("width", size.width.toString());
        logger.info("Image width x height", { ...size });
      }
    }
    return $.html();
  } catch (e: any) {
    // ignore
  }
  return html;
};

interface ICaptchaResult {
  success: boolean;
  challenge_ts: string;
  hostname: string;
  score: number;
  action: string;
}

export async function validateCaptcha(serverKey: string, clientToken: string) {
  if (process.env.NODE_ENV === "test") return true;
  try {
    const response: ICaptchaResult = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${serverKey}&response=${clientToken}`
    ).then((res) => res.json());

    if (response.success) {
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}

const prepareLink = (host: string, link: string | undefined) => {
  if (!link || link.length === 0) return "";
  const hasHttps = link && link.indexOf("https://") === 0;
  return hasHttps ? link : `${host}/${link}`;
};

export const getSocialLink = (social: Social) => {
  social.facebook = prepareLink("https://facebook.com", social.facebook);
  social.twitter = prepareLink("https://twitter.com", social.twitter);
  social.github = prepareLink("https://github.com", social.github);
  social.instagram = prepareLink("https://instagram.com", social.instagram);
  social.linkedin = prepareLink("https://linkedin.com/in", social.linkedin);

  return social;
};
