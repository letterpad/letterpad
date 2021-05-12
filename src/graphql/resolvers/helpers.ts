import { IImageAttrsResult } from "./../types";
import https from "https";
import cheerio from "cheerio";
import sizeOf from "image-size";
import { ISizeCalculationResult } from "image-size/dist/types/interface";
import { Post as ModelPost } from "../db/models/post";
import logger from "../../../shared/logger";

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
    if (!src) return;
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
  ).then(res => res.json());

  if (response.success) {
    return true;
  }
  console.log(response);
  return false;
}

export const getImageAttrs = (
  src: string,
  sizes?: number[],
  srcSizes?: string,
): IImageAttrsResult => {
  if (!src) return {};
  if (!sizes) sizes = [480, 720, 960, 1200, 1440, 1600, 2000];
  if (!srcSizes) srcSizes = `(max-width: 720px) 100vw, 720px`;
  let base64Url = makeCloudinaryUrl(src, 30);
  if (src.startsWith("/")) {
    return {
      src,
      loading: "lazy",
    };
  }
  const url = new URL(src);

  if (url.hostname.includes("cloudinary")) {
    const srcSet = sizes.map(w => makeCloudinaryImage(src, w)).join(", ");
    return {
      src: makeCloudinaryUrl(src, sizes[sizes.length - 1]),
      sizes: srcSizes,
      "data-srcset": srcSet,
      srcset: [base64Url],
      width: "100%",
      loading: "lazy",
      class: "lazyload",
    };
  }

  if (url.hostname.includes("unsplash")) {
    base64Url = makeUnsplashUrl(src, 30);
    const srcSet = sizes.map(w => makeUnsplashImage(src, w)).join(", ");
    return {
      src: makeUnsplashUrl(src, sizes[sizes.length - 1]),
      sizes: srcSizes,
      "data-srcset": srcSet,
      srcset: [base64Url],
      loading: "lazy",
      class: "lazyload",
    };
  }
  return {
    src,
    loading: "lazy",
  };
};

export const setResponsiveImages = (
  html: string,
  sizes?: number[],
  srcSizes?: string,
) => {
  if (!sizes) sizes = [480, 720, 960, 1200, 1440, 1600, 2000];
  // if (!srcSizes) srcSizes = `(max-width: 720px) 100vw, 720px`;

  const re = /<img\s+[^>]*src="([^"]*)"[^>]*>/g;
  const htmlWithResponsiveImages = html.replace(re, (str, src) => {
    const attrs = getImageAttrs(src, sizes);
    if (Object.keys(attrs).length > 0) {
      let attrString = "";
      Object.keys(attrs).forEach(key => {
        attrString += `${key}='${attrs[key]}' `;
      });
      return str.replace(`src="${src}"`, attrString);
    }
    return str;
  });

  return htmlWithResponsiveImages;
};

export function makeCloudinaryImage(src: string, width: number) {
  return `${makeCloudinaryUrl(src, width)} ${width}w`;
}

export function makeCloudinaryUrl(src, width) {
  const replace = /image\/upload\/(.*)\/blog-images/;
  const url = src.replace(
    replace,
    `image/upload/q_auto,f_auto,w_${width}/v1/blog-images`,
  );

  return url;
}

export function makeUnsplashImage(src: string, width: number, extras = "") {
  return `${makeUnsplashUrl(src, width, extras)} ${width}w`;
}

export function makeUnsplashUrl(src: string, width: number, extras = "") {
  const url = new URL(src);
  const baseUrl = `${url.protocol}//${url.hostname}${url.pathname}`;
  return `${baseUrl}?w=${width}&auto=format&lossless=true${extras}`;
}

export async function makeBase64Url(requestURL: string) {
  const response = await fetch(requestURL);
  //@ts-ignore
  const arrayBuffer = await response.buffer();
  const b64 = arrayBuffer.toString("base64");
  return `data:${response.headers.get("content-type")};base64,${b64}`;
}
