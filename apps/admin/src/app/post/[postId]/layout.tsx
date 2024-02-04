import type { Viewport } from "next";
import { Metadata } from "next";

export const viewport: Viewport = {
  themeColor: "black",
  width: "device-width",
};
export const metadata: Metadata = {
  title: "Editing Post",
  description: "Editing Post",
  robots: "no-follow, index",
  icons: [
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "logo/favicon-32x32.png",
      url: "logo/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: "logo/favicon-16x16.png",
      url: "logo/favicon-16x16.png",
    },
  ],
};

const Layout = ({ children }) => {
  return <div className="px-4 md:px-6">{children}</div>;
};

export default Layout;
