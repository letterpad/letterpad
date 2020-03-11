// import {
//   makeCloudinaryImage,
//   makeCloudinaryUrl,
//   makeUnsplashImage,
//   makeUnsplashUrl,
// } from "../api/utils/imageHelpers";

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

import { IImageAttrsResult } from "./types";

export interface IHelpers {
  getImageAttrs: (
    src: string,
    sizes?: number[],
    srcSizes?: string,
  ) => IImageAttrsResult;

  setResponsiveImages: (
    html: string,
    sizes?: number[],
    srcSizes?: string,
  ) => string;
}

export const getImageAttrs = (
  src: string,
  sizes?: number[],
  srcSizes?: string,
): IImageAttrsResult => {
  if (!src) return {};
  if (!sizes) sizes = [480, 720, 960, 1200, 1440, 1600, 2000];
  if (!srcSizes) srcSizes = `(max-width: 720px) 100vw, 720px`;
  const base64Url = makeCloudinaryUrl(src, 30);
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
    };
  }

  if (url.hostname.includes("unsplash")) {
    const base64Url = makeUnsplashUrl(src, 30);
    const srcSet = sizes.map(w => makeUnsplashImage(src, w)).join(", ");
    return {
      src: makeUnsplashUrl(src, sizes[sizes.length - 1]),
      sizes: srcSizes,
      "data-srcset": srcSet,
      srcset: [base64Url],
      loading: "lazy",
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
  if (!srcSizes) srcSizes = `(max-width: 720px) 100vw, 720px`;

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
