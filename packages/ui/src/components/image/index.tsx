import classNames from 'classnames';
import { forwardRef } from 'react';

export const Image = forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, src, alt, loading, ...props }, ref) => {

  const root = new URL(process.env.NEXT_PUBLIC_ROOT_URL! || process.env.NEXT_PUBLIC_API_URL!).origin;
  if (src?.startsWith('/') && process.env.NODE_ENV === 'production') {
    const fullImgUrl = new URL(src, root).href;
    src =`https://res.cloudinary.com/abhisheksaha/image/fetch/f_auto,q_auto/${fullImgUrl}`;

  }
  return (
    <img
      ref={ref}
      className={classNames(className)}
      alt={alt}
      loading={typeof loading === 'undefined' ? 'lazy' : loading}
      src={src}
      {...props}
    />
  );
});
Image.displayName = 'Image';
