import classNames from "classnames";
import { Metadata } from "next";

import "@/components/layouts/workspace.css";

import { fonts, workspaceFonts } from "../../../../components/fonts/fonts";

export const metadata: Metadata = {
  title: "Editing Post",
  description: "Editing Post",
};

const Layout = ({ children }) => {
  return (
    <div
      className={classNames(
        "admin-editor",
        workspaceFonts.sans.variable,
        workspaceFonts.serif.variable,
        fonts.code.variable
      )}
    >
      {children}
    </div>
  );
};

export default Layout;
