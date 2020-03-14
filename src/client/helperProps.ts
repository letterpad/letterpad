import {
  makeCloudinaryImage,
  makeCloudinaryUrl,
  makeUnsplashImage,
  makeUnsplashUrl,
} from "../api/providers/enhanceMediaUrl";

import { IImageAttrsResult } from "./types";

export interface IHelpers {
  /**
   * Use this function to create additional props which can asist to lazy load images.
   * Given an image with the below attributes, this method will trigger the lazy loading of this image.
   * ```
   * getImageAttrs("https://unsplash.com/a/b",
   *  [376, 515, 776, 992, 1200, 1600,2000],
   *  "(max-width: 720px) 100vw, 720px)";
   * ```
   */
  getImageAttrs: (
    src: string,
    sizes?: number[],
    srcSizes?: string,
  ) => IImageAttrsResult;

  /**
   * Used to trigger lazy loading of images.
   * Given an image with the below attributes, this method will trigger the lazy loading of this image.
   *```
   * <img
   *    src="image.png"
   *    sizes="(max-width: 720px) 100vw, 720px"
   *    data-srcset="small.jpg 500w,
   *      medium.jpg 640w,
   *      big.jpg 1024w"
   *    class="lazy"
   *  />
   * ```
   */
  triggerLazyLoad: () => void;

  /**
   * Use to set responsive attributes of images from unsplash or cloudinary
   * by passing a html string.
   *```
   * setResponsiveImages("<div><img src="https://unsplash.com/foo/bar" width="1000" width="700"></div>")
   * ```
   */
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

/**
 * Triggers a lazy load image
 */
export const triggerLazyLoad = () => {
  //@ts-ignore
  new LazyLoad({
    elements_selector: "img[loading='lazy']",
  });
};
