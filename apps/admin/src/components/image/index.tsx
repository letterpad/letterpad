import classNames from "classnames";
import { forwardRef } from "react";

import { getRootUrl } from "../../shared/getRootUrl";

export const Image = forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, src, alt, loading, ...props }, ref) => {
  if (src?.startsWith("/") && process.env.NODE_ENV === "production") {
    const fullImgUrl = new URL(src, getRootUrl()).href;
    src = `https://res.cloudinary.com/abhisheksaha/image/fetch/${fullImgUrl}`;
  }
  return (
    <img
      ref={ref}
      className={classNames(className)}
      alt={alt}
      loading={typeof loading === "undefined" ? "lazy" : loading}
      src={src}
      {...props}
    />
  );
});
Image.displayName = "Image";
