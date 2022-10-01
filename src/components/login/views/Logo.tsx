import Image from "next/image";

export const Logo = ({ width = 50 }) => {
  const theme =
    (typeof localStorage !== "undefined" && localStorage?.theme) ?? "light";

  const logo =
    theme === "light"
      ? "/admin/logo/lp_logo_black.svg"
      : "/admin/logo/lp_logo_white.svg";

  return <Image src={logo} width={width} height={width} />;
};
