import siteConfig from "config/site.config";

const Logo = ({ src }: { src: string }) => {
  return (
    <img
      src={src}
      height={siteConfig.header_height}
      style={{ padding: 24, objectFit: "contain" }}
    />
  );
};

export default Logo;
