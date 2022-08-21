import { Drawer } from "antd";
import { ReactNode } from "react";

import siteConfig from "@/config/site.config";

interface Props {
  isVisible: boolean;
  setIsVisible: (a: boolean) => void;
  children: ReactNode;
}

export const MobileMenu: React.VFC<Props> = ({
  isVisible,
  setIsVisible,
  children,
}) => {
  if (!isVisible) return null;

  return (
    <Drawer
      onClose={() => setIsVisible(false)}
      placement="left"
      contentWrapperStyle={{ boxShadow: "none" }}
      headerStyle={{
        padding: "0 24px",
        background: "none",
        borderColor: "#333",
      }}
      width={siteConfig.sidebar_width}
      visible={isVisible}
    >
      {children}
    </Drawer>
  );
};
