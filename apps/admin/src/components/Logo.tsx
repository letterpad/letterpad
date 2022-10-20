import siteConfig from "config/site.config";
import Image from "next/image";

const Logo = ({
  src,
  padding = 24,
  height = siteConfig.header_height,
}: {
  src?: string;
  padding?: number | string;
  height?: string | number;
  style?: any;
}) => {
  if (!src) return null;

  return (
    <div style={{ padding }}>
      <Image src={src} height={height} width={height} alt="logo" />
    </div>
  );
};

export default Logo;
