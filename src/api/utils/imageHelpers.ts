import { ISizeCalculationResult } from "image-size/dist/types/interface";
import cheerio from "cheerio";
import http from "http";
import logger from "../../shared/logger";
import retry from "./retry";
import sharp from "sharp";
import sizeOf from "image-size";

enum ImageType {
  featured_image,
  post_image,
  null,
}

interface IProps {
  type?: ImageType;
  tempPath: string;
  uploadDir: string;
  ext: string;
}

export default async function resizeImage({
  tempPath,
  uploadDir,
  ext,
}: IProps) {
  return new Promise((resolve, reject) => {
    let transform = sharp(tempPath);
    try {
      transform = transform.resize(1200, 1200, {
        withoutEnlargement: true,
        fit: sharp.fit.inside,
      });
      if (ext === "jpg") {
        transform = transform.jpeg({ quality: 80, progressive: true });
      } else if (ext === "png") {
        transform = transform.png({ quality: 80 });
      }
      transform.toFile(uploadDir, err => {
        return err ? reject(err) : resolve();
      });
    } catch (e) {
      reject(e);
    }
  });
}

export async function getImageDimensions(
  url: string,
): Promise<{ width: number; height: number; type: string }> {
  const withHttp = url.replace("https://", "http://");

  const actionToTry = () =>
    new Promise((resolve, reject) =>
      http.get(new URL(withHttp), function(response) {
        const chunks: Uint8Array[] = [];
        response
          .on("data", function(chunk: Uint8Array) {
            chunks.push(chunk);
          })
          .on("end", function() {
            const buffer = Buffer.concat(chunks);
            return resolve(sizeOf.imageSize(buffer));
          })
          .on("error", function(err) {
            return reject(err);
          });
      }),
    ) as Promise<ISizeCalculationResult>;

  const response = await retry(actionToTry, 1000, 3);
  return response as Promise<{ width: number; height: number; type: string }>;
}

const sizes = [480, 720, 960, 1200, 1440, 1600, 2000];
const srcSizes = `(max-width: 720px) 100vw, 720px`;

export const setResponsiveImages = async (html: string) => {
  logger.debug("Setting responsive image");
  const $ = cheerio.load(html);
  const $bodyImages = $("img");

  for (let i = 0; i < $bodyImages.length; i++) {
    const el = $bodyImages[i];
    const $el = $(el);
    $el.attr("loading", "lazy");
    let src = $el.attr("src");
    if (!src.startsWith("http")) return;
    src = src.replace("http://", "https://");
    const url = new URL(src);

    if (url.hostname.includes("unsplash")) {
      const base64Url = await makeBase64Url(makeUnsplashUrl(src, 30));
      const srcSet = sizes.map(w => makeUnsplashImage(src, w)).join(", ");
      $el.attr("src", makeUnsplashUrl(src, sizes[sizes.length - 1]));
      $el.attr("sizes", srcSizes);
      $el.attr("data-srcset", srcSet);
      $el.attr("srcset", base64Url);
      $el.attr("style", "max-width: 720px");
    } else if (url.hostname.includes("cloudinary")) {
      const originalSrc = $el.attr("src");

      const base64Url = await makeBase64Url(makeCloudinaryUrl(src, 30));
      const srcSet = sizes
        .map(w => makeCloudinaryImage(originalSrc, w))
        .join(", ");
      $el.attr("src", makeCloudinaryUrl(src, sizes[sizes.length - 1]));
      $el.attr("sizes", srcSizes);
      $el.attr("data-srcset", srcSet);
      $el.attr("srcset", base64Url);
      $el.attr("style", "max-width: 720px");
    }
    const size = await getImageDimensions(src);
    $el.attr("height", size.height);
    $el.attr("width", size.width);
  }
  return $.html();
};

export function makeUnsplashImage(src: string, width: number, extras = "") {
  return `${makeUnsplashUrl(src, width, extras)} ${width}w`;
}

export function makeCloudinaryImage(src: string, width: number) {
  return `${makeCloudinaryUrl(src, width)} ${width}w`;
}

export function makeUnsplashUrl(src: string, width: number, extras = "") {
  const url = new URL(src);
  const baseUrl = `${url.protocol}//${url.hostname}${url.pathname}`;
  return `${baseUrl}?w=${width}&auto=format&lossless=true${extras}`;
}

export function makeCloudinaryUrl(src, width) {
  const replace = /image\/upload\/(.*)\/blog-images/;
  const url = src.replace(
    replace,
    `image/upload/q_auto,f_auto,w_${width}/v1/blog-images`,
  );

  return url;
}

export async function makeBase64Url(requestURL) {
  const response = await fetch(requestURL);
  //@ts-ignore
  const arrayBuffer = await response.buffer();
  const b64 = arrayBuffer.toString("base64");
  return `data:${response.headers.get("content-type")};base64,${b64}`;
}
