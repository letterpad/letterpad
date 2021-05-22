import { Image } from "antd";
import siteConfig from "config/site.config";

const Logo = ({ src }: { src: string }) => {
  return (
    <Image
      src={src}
      height={siteConfig.header_height}
      style={{ padding: 20, objectFit: "contain" }}
      preview={false}
    />
  );
};

export default Logo;
