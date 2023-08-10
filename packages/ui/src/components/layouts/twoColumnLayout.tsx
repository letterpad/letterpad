"use client";
import classNames from "classnames";
import { FC, ReactNode, useEffect, useState } from "react";

import { useResponsiveLayout } from "./responsiveProvider";
import { useResponsive } from "./useResponsive";

interface Props {
  left: ReactNode;
  right: ReactNode;
}

export const TwoColumnLayout: FC<Props> = ({ left, right }) => {
  const { sidebarVisible, setSidebarVisible } = useResponsiveLayout();

  return (
    <>
      <div className="fixed flex min-h-screen w-full flex-row bg-white dark:bg-zinc-900">
        <aside
          className={classNames(
            "top-0  h-screen min-w-[250px] -translate-x-full transform bg-zinc-800 transition-transform duration-150 ease-in md:sticky  md:translate-x-0 md:shadow",
            {
              "translate-x-0": sidebarVisible,
            }
          )}
        >
          {left}
        </aside>
        <div
          className={classNames(
            "main flex min-w-full flex-grow -translate-x-[250px] flex-col transition-all duration-150 ease-in md:ml-0 md:min-w-fit md:translate-x-0",
            {
              "translate-x-0": sidebarVisible,
            }
          )}
          onClick={() => sidebarVisible && setSidebarVisible(false)}
        >
          {right}
        </div>
      </div>
    </>
  );
};
