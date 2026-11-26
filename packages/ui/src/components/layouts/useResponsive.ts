"use client";
import { useCallback, useEffect, useState } from "react";

export const useResponsive = () => {
  // Use the same first-render width on the server and browser. The effect
  // updates it to the real viewport after hydration.
  const [width, setWidth] = useState(1024);

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
  const isDesktop = width > 1024;

  return {
    isDesktop,
    isMobile,
    isTablet,
    isMobileOrTablet: isMobile || isTablet,
  };
};
