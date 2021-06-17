import https from "https";
import cheerio from "cheerio";
import sizeOf from "image-size";
import { ISizeCalculationResult } from "image-size/dist/types/interface";
import { Post as ModelPost } from "../db/models/post";
import logger from "./../../shared/logger";

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
  const $ = cheerio.load(html, { xmlMode: true });
  logger.debug("Setting image width and height inside html");
  const $bodyImages = $("img");

  for (let i = 0; i < $bodyImages.length; i++) {
    const el = $bodyImages[i];
    const $el = $(el);
    $el.attr("loading", "lazy");
    let src = $el.attr("src");
    if (!src) return;
    if (!src.startsWith("http")) return;
    logger.debug("Getting dimensions of ", src);
    const size = await getImageDimensions(src);
    $el.attr("height", size.height.toString());
    $el.attr("width", size.width.toString());
    logger.info("Image width x height", { ...size });
  }
  return $.html();
};

interface ICaptchaResult {
  success: boolean;
  challenge_ts: string;
  hostname: string;
  score: number;
  action: string;
}

export async function validateCaptcha(serverKey: string, clientToken: string) {
  const response: ICaptchaResult = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${serverKey}&response=${clientToken}`,
  ).then((res) => res.json());

  if (response.success) {
    return true;
  }
  return false;
}
