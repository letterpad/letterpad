import { Prisma } from "@prisma/client";
import cheerio from "cheerio";
import https from "https";
import sizeOf from "image-size";
import reading_time from "reading-time";

import { Social } from "@/__generated__/__types__";
import logger from "@/shared/logger";
import { textToSlug } from "@/utils/slug";

const slugOfUntitledPost = "untitled";

export async function slugify(
  PostModel: Prisma.PostDelegate<false>,
  slug: string = slugOfUntitledPost,
  author_id: number,
): Promise<string> {
  slug = textToSlug(slug);
  const result = await PostModel.findFirst({
    where: { slug: slug, author: { id: author_id } },
  });
  if (result === null) {
    return slug;
  }
  let count = 1;
  slug += "-";

  async function recursiveFindUniqueSlug() {
    const result = await PostModel.findFirst({
      where: { slug: slug + count, author: { id: author_id } },
    });

    if (result === null) {
      return slug + count;
    }
    count++;
    return recursiveFindUniqueSlug();
  }

  return recursiveFindUniqueSlug();
}

export const getReadableDate = (timestamp: Date) => {
  return new Date(timestamp).toLocaleString("en-us", {
    month: "long",
    year: "numeric",
    day: "numeric",
  });
};

export async function getImageDimensions(
  url: string,
): Promise<{ width: number; height: number; type: string }> {
  const actionToTry = () =>
    new Promise((resolve, reject) =>
      https.get(new URL(url), function (response) {
        const chunks: Uint8Array[] = [];
        response
          .on("data", function (chunk: Uint8Array) {
            chunks.push(chunk);
          })
          .on("end", async function () {
            const buffer = Buffer.concat(chunks);
            return resolve(sizeOf(buffer));
          })
          .on("error", function (err) {
            return reject(err);
          });
      }),
    );

  const response = actionToTry();
  return response as Promise<{ width: number; height: number; type: string }>;
}

export const setImageWidthAndHeightInHtml = async (html: string) => {
  try {
    const $ = cheerio.load(html, {
      xmlMode: true,
      decodeEntities: false,
      normalizeWhitespace: false,
    });
    logger.debug("Setting image width and height inside html");
    const $bodyImages = $("img");

    for (let i = 0; i < $bodyImages.length; i++) {
      const el = $bodyImages[i];
      const $el = $(el);
      $el.attr("loading", "lazy");
      const src = $el.attr("src");
      if (!src) return;
      if (!src.startsWith("http")) return;
      logger.debug("Getting dimensions of ", src);
      const size = await getImageDimensions(src);
      $el.attr("height", size.height.toString());
      $el.attr("width", size.width.toString());
      logger.info("Image width x height", { ...size });
    }
    return $.html();
  } catch (e) {
    // ignore
  }
  return html;
};

export const getReadingTimeFromHtml = (html: string) => {
  const $ = cheerio.load(html);
  const text = $.text();
  return reading_time(text).text;
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
  const response: ICaptchaResult = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${serverKey}&response=${clientToken}`,
  ).then((res) => res.json());

  if (response.success) {
    return true;
  }
  return false;
}

const prepareLink = (host: string, link: string | undefined) => {
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
