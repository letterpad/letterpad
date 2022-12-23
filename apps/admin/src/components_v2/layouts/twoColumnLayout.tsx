import classNames from "classnames";
import { FC, ReactNode } from "react";

import { SiteFooter } from "@/components/layouts/site-footer";

import { useResponsiveLayout } from "./responsiveProvider";

interface Props {
  left: ReactNode;
  right: ReactNode;
}

export const TwoColumnLayout: FC<Props> = ({ left, right }) => {
  const { sidebarVisible, setSidebarVisible, isMobileOrTablet, isDesktop } =
    useResponsiveLayout();

  return (
    <>
      {/* {sidebarVisible && (
        <div
          onClick={() => setSidebarVisible(false)}
          className="fixed inset-0 bg-zinc-800 bg-opacity-50 dark:bg-opacity-80"
        ></div>
      )} */}
      <div className="fixed flex min-h-screen w-full flex-row bg-gray-100 dark:bg-zinc-900">
        <aside
          className={classNames(
            "top-0  h-screen min-w-[250px] -translate-x-full transform bg-zinc-900 transition-transform duration-150 ease-in md:sticky  md:shadow",
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
              "translate-x-0 blur-lg": sidebarVisible && isMobileOrTablet,
              "min-w-full": !!isMobileOrTablet,
            }
          )}
          onClick={() => sidebarVisible && setSidebarVisible(!isMobileOrTablet)}
        >
          <div className="px-6">{right}</div>
          <SiteFooter />
        </div>
      </div>
    </>
  );
};
