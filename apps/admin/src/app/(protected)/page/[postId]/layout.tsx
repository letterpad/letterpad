import classNames from "classnames";

import { fonts } from "../../../../components/fonts/fonts";

const Layout = ({ children }) => {
  return (
    <div
      className={classNames(
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
