import classNames from "classnames";

import "@/components/layouts/workspace.css";

import { fonts, workspaceFonts } from "../../../../components/fonts/fonts";

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
