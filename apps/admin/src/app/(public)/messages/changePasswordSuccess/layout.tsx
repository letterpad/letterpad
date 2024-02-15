import { Metadata } from "next";

import MessageLayout from "@/components/layouts/MessageLayout";

export const metadata: Metadata = {
  title: "Letterpad - Password Changed",
};
const Layout = ({ children }) => {
  return <MessageLayout>{children}</MessageLayout>;
};

export default Layout;
