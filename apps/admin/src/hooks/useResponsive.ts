import { useCallback, useEffect, useState } from "react";

interface ResponsiveConfig {
  [key: string]: number;
}
interface ResponsiveInfo {
  [key: string]: boolean;
}

let responsiveConfig: ResponsiveConfig = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
};

export function configResponsive(config: ResponsiveConfig) {
  responsiveConfig = config;
  calculate();
}

let info: ResponsiveInfo = {};

function calculate() {
  if (typeof window === "undefined") return;

  const width = window.innerWidth;
  const newInfo = {} as ResponsiveInfo;
  let shouldUpdate = false;
  for (const key of Object.keys(responsiveConfig)) {
    newInfo[key] = width >= responsiveConfig[key];
    if (newInfo[key] !== info[key]) {
      shouldUpdate = true;
    }
  }
  if (shouldUpdate) {
    info = newInfo;
  }
}
calculate();

export const useResponsive = () => {
  const [state, setState] = useState<ResponsiveInfo>({ ...info });

  const doResize = useCallback(() => {
    const oldInfo = state;
    calculate();
    if (str(oldInfo) === str(info)) return;
    setState({ ...info });
  }, [state]);

  useEffect(() => {
    doResize();
    window.addEventListener("resize", doResize);
    return () => window.removeEventListener("resize", doResize);
  }, [doResize]);

  return state;
};

const str = (obj) => JSON.stringify(obj);
