import siteConfig from "config/site.config";

const Logo = ({
  src,
  padding = 24,
  height = siteConfig.header_height,
}: {
  src?: string;
  padding?: number | string;
  height?: string | number;
}) => {
  if (!src) return null;
  return (
    <img
      src={src}
      height={height}
      style={{ padding, objectFit: "contain" }}
      alt="logo"
    />
  );
};

export default Logo;
