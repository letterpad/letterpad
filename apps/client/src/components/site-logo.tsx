import Image from 'next/image';

interface Logo {
  __typename?: 'Image';
  src?: string | null;
  width?: number | null;
  height?: number | null;
}

export const LogoOrTitle = ({
  logo,
  title,
}: {
  logo?: Logo | null;
  title: string;
}) => {
  const logoProps = getLogoWidthAndHeight({ ...logo, title });
  const { className, ...props } = logoProps;
  const hasTitle = typeof title === 'string';
  const siteName = hasTitle ? (
    <span className="lp-title flex items-center text-[1.5rem] font-extrabold md:text-2xl">
      {title}
    </span>
  ) : (
    ''
  );

  return (
    <div className={'lp-container flex justify-between ' + className}>
      {logo?.src ? (
        <span className="lp-logo mr-2 flex">
          <Image alt={title} {...props} src={logo.src} />
        </span>
      ) : (
        siteName
      )}
    </div>
  );
};

interface Props2 extends Logo {
  title?: string;
}
function getLogoWidthAndHeight({ width, height, src, title = '' }: Props2) {
  if (!width || !height) {
    return { width: 65, height: 65, src, className: '' };
  }
  const ratio = width / height;

  if (ratio === 1) {
    return { width: 65, height: 65, src, className: 'flex-row items-left' };
  }
  if (ratio > 1) {
    let newHeight = Math.min(65, 65 / ratio);
    let className = 'flex-col items-left';
    if (title.length <= 20) {
      className = 'flex-row items-center';
    }
    return { width: 65 * ratio, height: newHeight, src, className };
  }
  if (ratio < 1) {
    let newHeight = Math.min(65, 65 / ratio);
    return {
      width: 65,
      height: newHeight,
      src,
      className: 'flex-row items-left',
    };
  }
  return { width, height, src, className: '' };
}
