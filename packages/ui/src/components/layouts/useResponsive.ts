"use client";
import { useCallback, useEffect, useState } from "react";

export const useResponsive = () => {
  const initialWidth = typeof window !== "undefined" ? window.innerWidth : 0;
  const [width, setWidth] = useState(initialWidth);

  const handleWindowSizeChange = useCallback(() => {
    setWidth(typeof window !== "undefined" ? window.innerWidth : 0);
  }, []);

  useEffect(() => {
    handleWindowSizeChange();
    window.addEventListener("resize", handleWindowSizeChange);

    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, [handleWindowSizeChange]);

  const isMobile = width <= 768;
  const isTablet = width <= 1024;
  const isDesktop = width > 1024 || typeof window === "undefined";

  return {
    isDesktop,
    isMobile,
    isTablet,
    isMobileOrTablet:
      typeof window === "undefined" ? false : isMobile || isTablet,
  };
};
