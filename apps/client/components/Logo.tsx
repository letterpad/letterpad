import Image from 'next/image';

interface Logo {
  width?: number;
  height?: number;
  src?: string;
}

export const LogoWithTitle = ({ logo, title }: { logo: Logo; title: string }) => {
  const logoProps = getLogoWidthAndHeight({ ...logo, title });
  const { className, ...props } = logoProps;
  return (
    <div className={'flex justify-between ' + className}>
      <span className="mr-2 flex">
        {logo.src && <Image src={logo.src} alt={title} {...props} />}
      </span>

      {typeof title === 'string' && (
        <div className="mt-2 hidden text-sm font-light italic sm:block">{title}</div>
      )}
    </div>
  );
};

interface Props2 extends Logo {
  title?: string;
}
function getLogoWidthAndHeight({ width, height, src, title = '' }: Props2) {
  if (!width || !height) {
    return { width: 40, height: 40, src };
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
    return { width: 140, height: 140 / ratio, src, className };
  }
  if (ratio < 1) {
    const ratio = width / height;
    return { width: 40, height: 40 / ratio, src, className: 'flex-row items-left ' };
  }
}
