import classNames from "classnames";
import { FC, ReactNode } from "react";

import { useResponsiveLayout } from "./responsiveProvider";

interface Props {
  left: ReactNode;
  right: ReactNode;
}

export const TwoColumnLayout: FC<Props> = ({ left, right }) => {
  const { sidebarVisible, setSidebarVisible, isMobileOrTablet, isDesktop } =
    useResponsiveLayout();

  return (
    <div className="flex min-h-screen w-full flex-row bg-gray-100 text-gray-800 dark:bg-zinc-900 dark:text-gray-800">
      <aside
        className={classNames(
          "min-w-[250px] -translate-x-full transform bg-zinc-900 transition-transform duration-150 ease-in md:sticky  md:shadow",
          { "translate-x-0": sidebarVisible || isDesktop },
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
          },
        )}
        onClick={() => sidebarVisible && setSidebarVisible(!isMobileOrTablet)}
      >
        {right}
      </div>
    </div>
  );
};
