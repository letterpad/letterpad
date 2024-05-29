import classNames from 'classnames';
import { Image } from 'ui/dist/isomorphic.mjs';

interface Logo {
  __typename?: 'Image';
  src?: string | null;
  width?: number | null;
  height?: number | null;
}

export const LogoOrTitle = ({
  logo,
  title,
  tagline,
}: {
  logo?: Logo | null;
  title: string;
  tagline?: string;
}) => {
  const logoProps = getLogoWidthAndHeight({ ...logo, title });
  const { className, ...props } = logoProps;
  const hasTitle = typeof title === 'string';
  const logoSrc = logo && logo.src;
  const siteName = hasTitle ? (
    <span className="lp-title text-[1.5rem] font-extrabold md:text-2xl">
      {title}
    </span>
  ) : (
    ''
  );

  return (
    <div
      className={
        'lp-container flex justify-between flex-row items-center gap-2' +
        className
      }
    >
      {logoSrc && (
        <span className="lp-logo mr-2 flex">
          <Image alt={title} {...props} src={logoSrc} />
        </span>
      )}
      <div className={classNames('flex flex-col')}>
        <div className={classNames({ 'text-center md:text-left': !logoSrc })}>
          {siteName}
        </div>
        <span className="text-sm">{tagline}</span>
      </div>
    </div>
  );
};

interface Props2 extends Logo {
  title?: string;
}
function getLogoWidthAndHeight({ width, height, src, title = '' }: Props2) {
  if (!width || !height) {
    return { width: 50, height: 50, src, className: '' };
  }
  const ratio = width / height;

  if (ratio === 1) {
    return { width: 50, height: 50, src, className: 'flex-row items-left' };
  }
  if (ratio > 1) {
    let newHeight = Math.min(50, 50 / ratio);
    let className = 'flex-col items-left';
    if (title.length <= 20) {
      className = 'flex-row items-center';
    }
    return { width: 50 * ratio, height: newHeight, src, className };
  }
  if (ratio < 1) {
    let newHeight = Math.min(50, 50 / ratio);
    return {
      width: 50,
      height: newHeight,
      src,
      className: 'flex-row items-left',
    };
  }
  return { width, height, src, className: '' };
}
