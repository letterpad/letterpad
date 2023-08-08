"use client";
import classNames from "classnames";
import { FC, ReactNode, useState } from "react";

import { useResponsiveLayout } from "./responsiveProvider";
import { useResponsive } from "./useResponsive";

interface Props {
  left: ReactNode;
  right: ReactNode;
}

export const TwoColumnLayout: FC<Props> = ({ left, right }) => {
  const { isMobileOrTablet, isDesktop, sidebarVisible, setSidebarVisible } =
    useResponsiveLayout();

  return (
    <>
      <div className="fixed flex min-h-screen w-full flex-row bg-white dark:bg-zinc-900">
        <aside
          className={classNames(
            "top-0  h-screen min-w-[250px] -translate-x-full transform bg-zinc-800 transition-transform duration-150 ease-in md:sticky  md:shadow",
            { "translate-x-0": sidebarVisible || isDesktop }
          )}
        >
          {left}
        </aside>
        <div
          className={classNames(
            "main  flex flex-grow flex-col transition-all duration-150 ease-in md:ml-0",
            {
              "-ml-[250px]": !sidebarVisible,
              "translate-x-0": sidebarVisible && isMobileOrTablet,
              "min-w-full": !!isMobileOrTablet,
            }
          )}
          onClick={() => sidebarVisible && setSidebarVisible(!isMobileOrTablet)}
        >
          {right}
        </div>
      </div>
    </>
  );
};
