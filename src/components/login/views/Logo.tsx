import Image from "next/image";

export const Logo = () => {
  const theme =
    typeof localStorage !== "undefined" ? localStorage.theme : "light";
  const logo =
    theme === "light"
      ? "/admin/logo/lp_logo_black.svg"
      : "/admin/logo/lp_logo_white.svg";
  return <Image src={logo} width={50} height={50} />;
};
