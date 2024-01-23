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
    <span className="lp-title flex items-center text-[2rem] font-extrabold md:text-2xl">
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
    return { width: 80, height: 80, src, classname: '' };
  }
  const ratio = width / height;

  if (ratio === 1) {
    return { width: 80, height: 80, src, className: 'flex-row items-left ' };
  }
  if (ratio > 1) {
    const ratio = width / height;
    let className = ' flex-col items-left';
    if (title.length <= 20) {
      className = ' flex-row items-center';
    }
    return { width: 80, height: 80 / ratio, src, className };
  }
  if (ratio < 1) {
    const ratio = width / height;
    return {
      width: 80,
      height: 80 / ratio,
      src,
      className: 'flex-row items-left ',
    };
  }
  return { classname: '', width, height, src };
}
