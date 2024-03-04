import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editing Post",
  description: "Editing Post",
};

const Layout = ({ children }) => {
  return <div className="px-4 md:px-6">{children}</div>;
};

export default Layout;
