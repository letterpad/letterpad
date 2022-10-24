import Image from "next/image";

export const Logo = ({ width = 50, isDarkBg }) => {
  const theme =
    (typeof localStorage !== "undefined" && localStorage?.theme) ?? "light";

  let logo =
    theme === "light"
      ? "/admin/logo/lp_logo_black.svg"
      : "/admin/logo/lp_logo_white.svg";

  if (isDarkBg) {
    logo = "/admin/logo/lp_logo_white.svg";
  }

  return <Image src={logo} width={width} height={width} alt="Letterpad" />;
};
