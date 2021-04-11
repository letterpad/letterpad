import http from "http";
import cheerio from "cheerio";
import sizeOf from "image-size";
import { ISizeCalculationResult } from "image-size/dist/types/interface";
import { Post as ModelPost, PostAttributes } from "./../../db/models/post";
import logger from "../../shared/logger";
import config from "../../config";
import { Post } from "../../__generated__/lib/type-defs.graphqls";

function toSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s\-]/g, " ")
    .split(" ")
    .filter(function (substr) {
      return substr.length > 0;
    })
    .join("-");
}

export async function slugify(
  PostModel: typeof ModelPost,
  slug: string,
): Promise<string> {
  slug = toSlug(slug);
  const result = await PostModel.findOne({ where: { slug: slug } });

  if (result === null) {
    return slug;
  }
  let count = 1;
  slug += "-";

  async function recursiveFindUniqueSlug() {
    const result = await PostModel.findOne({ where: { slug: slug + count } });

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

export const getDateTime = (timestamp: number) => {
  const m = new Date(timestamp);

  const dateString =
    m.getUTCFullYear() +
    "-" +
    ("0" + (m.getUTCMonth() + 1)).slice(-2) +
    "-" +
    ("0" + m.getUTCDate()).slice(-2) +
    " " +
    ("0" + m.getUTCHours()).slice(-2) +
    ":" +
    ("0" + m.getUTCMinutes()).slice(-2) +
    ":" +
    ("0" + m.getUTCSeconds()).slice(-2);

  return dateString;
};

export async function getImageDimensions(
  url: string,
): Promise<{ width: number; height: number; type: string }> {
  const actionToTry = () =>
    new Promise((resolve, reject) =>
      http.get(new URL(url), function (response) {
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
    ) as Promise<ISizeCalculationResult>;

  const response = actionToTry();
  return response as Promise<{ width: number; height: number; type: string }>;
}

export const setImageWidthAndHeightInHtml = async (html: string) => {
  const $ = cheerio.load(html, { xmlMode: true });
  logger.debug("Setting image width and height inside html");
  const $bodyImages = $("img");

  for (let i = 0; i < $bodyImages.length; i++) {
    const el = $bodyImages[i];
    const $el = $(el);
    $el.attr("loading", "lazy");
    let src = $el.attr("src");
    if (!src.startsWith("http")) return;
    logger.debug("Getting dimensions of ", src);
    const size = await getImageDimensions(src);
    // src = src.replace("http://", "https://");
    $el.attr("height", size.height.toString());
    $el.attr("width", size.width.toString());
    logger.info("Image width x height", { ...size });
  }
  return $.html();
};

export function normalizePost(postFromDb: PostAttributes): Post {
  const host = config.ROOT_URL + config.BASE_NAME;
  let {
    cover_image_width,
    cover_image_height,
    cover_image,
    slug,
    ...rest
  } = postFromDb;
  if (cover_image && cover_image.startsWith("/")) {
    cover_image = host + "/" + cover_image;
  }

  // normalize cover image
  const post = {
    ...rest,
    cover_image: {
      src: cover_image || "",
      width: cover_image_width || 0,
      height: cover_image_height || 0,
    },
    slug: "/" + rest.type + "/" + slug,
    publishedAt: (getReadableDate(rest.publishedAt) as unknown) as Date,
    updatedAt: (getReadableDate(rest.updatedAt) as unknown) as Date,
    createdAt: (getReadableDate(rest.createdAt) as unknown) as Date,
  };

  return post;
}
