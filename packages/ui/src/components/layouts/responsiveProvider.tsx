"use client";

import { createContext, FC, ReactNode, useContext, useEffect, useState } from "react";

import { useResponsive } from "./useResponsive";

interface Props {
  sidebarVisible: boolean;
  setSidebarVisible: (flag: boolean) => void;
  isMobileOrTablet: boolean;
  isDesktop: boolean;
  isMobile: boolean;
  isTablet: boolean;
}
const Responsive = createContext<Props>({} as Props);

export const ResponsiveProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { isDesktop, isMobileOrTablet, isMobile, isTablet } = useResponsive();
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const value = {
    sidebarVisible,
    setSidebarVisible,
    isMobileOrTablet,
    isDesktop,
    isMobile,
    isTablet,
  };
  useEffect(()=>{
    setSidebarVisible(isDesktop)
  },[isDesktop])
  return <Responsive.Provider value={value}>{children}</Responsive.Provider>;
};

export const useResponsiveLayout = () => {
  return useContext(Responsive);
};
