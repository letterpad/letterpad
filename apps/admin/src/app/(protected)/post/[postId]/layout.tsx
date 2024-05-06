import classNames from "classnames";
import { Metadata } from "next";

import { fonts } from "../../../../components/fonts/fonts";

export const metadata: Metadata = {
  title: "Editing Post",
  description: "Editing Post",
};

const Layout = ({ children }) => {
  return (
    <div
      className={classNames(
        "px-4 md:px-6",
        fonts.paragraph.variable,
        fonts.code.variable,
        fonts.heading.variable,
        fonts.sans.variable
      )}
    >
      {children}
    </div>
  );
};

export default Layout;
