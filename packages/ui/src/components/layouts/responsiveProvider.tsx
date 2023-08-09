"use client";
import { createContext, FC, ReactNode, useContext, useState } from "react";

import { useResponsive } from "./useResponsive";

interface Props {
  sidebarVisible: boolean;
  setSidebarVisible: (flag: boolean) => void;
  isMobileOrTablet: boolean;
  isDesktop: boolean;
  isMobile: boolean;
}
const Responsive = createContext<Props>({} as Props);

export const ResponsiveProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { isDesktop, isMobileOrTablet, isMobile } = useResponsive();
  const [sidebarVisible, setSidebarVisible] = useState(!isMobileOrTablet);
  const value = {
    sidebarVisible,
    setSidebarVisible,
    isMobileOrTablet,
    isDesktop,
    isMobile,
  };
  return <Responsive.Provider value={value}>{children}</Responsive.Provider>;
};

export const useResponsiveLayout = () => {
  return useContext(Responsive);
};
