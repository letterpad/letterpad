import { FC } from "react";
import { Image } from "ui/dist/isomorphic.mjs";

interface Props {
  isDarkBg?: boolean;
  width?: number;
}
export const Logo: FC<Props> = ({ width = 150, isDarkBg }) => {
  const theme =
    (typeof localStorage !== "undefined" && localStorage?.theme) ?? "light";

  let logo =
    theme === "light" ? "/logo/lp_logo_black.svg" : "/logo/lp_logo_white.svg";

  if (isDarkBg) {
    logo = "/logo/lp_logo_white.svg";
  }

  logo = "/logo/logo-full.png";

  return <Image src={logo} width={width} height={34} alt="Letterpad" />;
};
