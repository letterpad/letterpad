import Image from 'next/image';

interface Logo {
  __typename?: 'Image';
  src?: string | null;
  width?: number | null;
  height?: number | null;
}

export const LogoWithTitle = ({
  logo,
  title,
}: {
  logo?: Logo | null;
  title: string;
}) => {
  const logoProps = getLogoWidthAndHeight({ ...logo, title });
  const { className, ...props } = logoProps;
  const hasTitle = typeof title === 'string';
  const logoExist = !!logo?.src;
  return (
    <div className={'flex justify-start ' + className}>
      {logo?.src && (
        <span className="mr-2 flex">
          <Image alt={title} {...props} src={logo.src} />
        </span>
      )}
      {hasTitle &&
        (logoExist ? (
          <div className="mt-2 hidden text-lg font-bold md:block">{title}</div>
        ) : (
          <div className="text-lg font-bold">{title}</div>
        ))}
    </div>
  );
};

interface Props2 extends Logo {
  title?: string;
}
function getLogoWidthAndHeight({ width, height, src, title = '' }: Props2) {
  if (!width || !height) {
    return { width: 40, height: 40, src, classname: '' };
  }
  const ratio = width / height;

  if (ratio === 1) {
    return { width: 40, height: 40, src, className: 'flex-row items-left ' };
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
      width: 40,
      height: 40 / ratio,
      src,
      className: 'flex-row items-left ',
    };
  }
  return { classname: '', width, height, src };
}
