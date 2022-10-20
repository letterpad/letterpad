import Sider from "antd/lib/layout/Sider";
import { ReactNode } from "react";

import siteConfig from "@/config/site.config";

interface Props {
  isVisible: boolean;
  setIsVisible: (a: boolean) => void;
  children: ReactNode;
}

export const DesktopMenu: React.VFC<Props> = ({ children }) => {
  return (
    <Sider
      breakpoint="lg"
      collapsedWidth="0"
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
      }}
      width={siteConfig.sidebar_width}
    >
      {children}
    </Sider>
  );
};
