import { Image } from "antd";

const Logo = ({ src }: { src: string }) => {
  return <Image src={src} width={80} style={{ padding: 20 }} preview={false} />;
};

export default Logo;
