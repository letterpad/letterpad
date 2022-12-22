import { createContext, useContext, useState } from "react";

import { useResponsive } from "@/hooks/useResponsive";

interface Props {
  sidebarVisible: boolean;
  setSidebarVisible: (flag: boolean) => void;
  isMobileOrTablet: boolean;
  isDesktop: boolean;
}
const Responsive = createContext<Props>({} as Props);

export const ResponsiveProvider = ({ children }) => {
  const { md, lg } = useResponsive();
  const isDesktop = md || lg;
  const isMobileOrTablet = !md;
  const [sidebarVisible, setSidebarVisible] = useState(!isMobileOrTablet);
  const value = {
    sidebarVisible,
    setSidebarVisible,
    isMobileOrTablet,
    isDesktop,
  };

  return <Responsive.Provider value={value}>{children}</Responsive.Provider>;
};

export const useResponsiveLayout = () => {
  return useContext(Responsive);
};
