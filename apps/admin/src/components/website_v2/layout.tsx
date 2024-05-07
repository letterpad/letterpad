import classNames from "classnames";
import React, { FC, ReactNode, Suspense } from "react";

import { Divider } from "./divider";

interface Props {
  FirstBlock: ReactNode;
  SecondBlockMobileOnly: ReactNode;
  ThirdBlock: ReactNode;
  SidebarBlock1: ReactNode;
  SidebarBlock2: ReactNode;
  Content: ReactNode;
}
export const HomeLayout: FC<Props> = async ({
  FirstBlock,
  SecondBlockMobileOnly,
  ThirdBlock,
  Content,
  SidebarBlock1,
  SidebarBlock2,
}) => {
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <div className="max-w-6xl mx-auto px-4 gap-4 flex flex-col py-8">
          <Suspense>{FirstBlock}</Suspense>
        </div>
        {/* <Divider /> */}
        <main className="grow space-y-16 py-0">
          <div
            className="max-w-6xl mx-auto px-4 gap-4 flex flex-col"
            data-aos="fade-down"
            data-aos-easing="linear"
            data-aos-duration="200"
            data-aos-delay="200"
          >
            {ThirdBlock}
          </div>
          <Divider className="md:hidden" />
          <div className="z-10 md:hidden pt-16">
            <div className="mx-auto px-4 relative">{SecondBlockMobileOnly}</div>
          </div>
          <Divider />
          <div className="flex flex-row max-w-6xl mx-auto px-4 divide-x-[1px] dark:divide-slate-800 divide-slate-200">
            {Content}
            <div
              className={classNames(
                "hidden md:min-w-80 top-0  md:pl-10 md:block"
              )}
            >
              <div className="space-y-8 sticky top-10">
                {SidebarBlock1}

                <section
                  className="block max-w-md"
                  data-aos="zoom-in"
                  data-aos-easing="linear"
                  data-aos-duration="200"
                  data-aos-delay="100"
                >
                  {SidebarBlock2}
                </section>
              </div>
            </div>
          </div>
        </main>
        {/* <Aos /> */}
      </div>
    </>
  );
};
