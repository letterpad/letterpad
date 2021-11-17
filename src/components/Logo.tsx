import siteConfig from "config/site.config";

const Logo = ({ src }: { src?: string }) => {
  if (src) return null;
  return (
    <img
      src={src}
      height={siteConfig.header_height}
      style={{ padding: 24, objectFit: "contain" }}
    />
  );
};

export default Logo;
