"use client";
import classNames from "classnames";
import { FC, ReactNode, useEffect } from "react";

import { useResponsiveLayout } from "./responsiveProvider";

interface Props {
  left: ReactNode;
  right: ReactNode;
  className?: string;
}

export const TwoColumnLayout: FC<Props> = ({ left, right, className }) => {
  const { isDesktop, sidebarVisible, setSidebarVisible } = useResponsiveLayout();

  useEffect(()=>{
    setSidebarVisible(isDesktop)
  },[isDesktop, setSidebarVisible]);

  return (
    <>
      <div className={classNames("flex max-h-screen relative w-full flex-row bg-white dark:bg-zinc-900",className)}>
        <aside
          className={classNames(
            "top-0 min-w-[250px] transform bg-zinc-800 transition-transform duration-150 ease-in sticky md:shadow",
            {
              "translate-x-0": sidebarVisible,
              "-translate-x-full": !sidebarVisible,
            }
          )}
        >
          {left}
        </aside>
        <div
          className={classNames(
            "main flex w-full flex-1 flex-col transition-all duration-150 ease-in md:ml-0 overflow-hidden min-h-screen",
            {
              "translate-x-0": sidebarVisible,
              "-translate-x-[250px] min-w-full": !sidebarVisible,
            }
          )}
          onClick={() => !isDesktop && sidebarVisible && setSidebarVisible(false)}
        >
          {right}
        </div>
      </div>
    </>
  );
};
