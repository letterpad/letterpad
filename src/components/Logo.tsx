import siteConfig from "config/site.config";

const Logo = ({
  src,
  padding = 24,
  height = siteConfig.header_height,
}: {
  src?: string;
  padding?: number;
  height?: string | number;
}) => {
  if (!src) return null;
  return (
    <img src={src} height={height} style={{ padding, objectFit: "contain" }} />
  );
};

export default Logo;
