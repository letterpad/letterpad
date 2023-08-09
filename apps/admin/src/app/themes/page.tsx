"use client";
import classNames from "classnames";
import Head from "next/head";
import Image from "next/image";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Button, Content, PageHeader, RadioGroup } from "ui";

import { useUpdateSettings } from "@/hooks/useUpdateSettings";

import { themes as themesList } from "../../components/themes/themes";
import { useDataProvider } from "../../context/DataProvider";

const Themes = () => {
  const { updateSettings } = useUpdateSettings();
  const { settings } = useDataProvider();
  return (
    <>
      <Head>
        <title>Themes</title>
      </Head>
      <PageHeader className="site-page-header" title="Themes">
        <span className="help-text">
          Select the theme you want to use for your site. Remember that few
          themes might not have all the features that are available.
        </span>
      </PageHeader>
      <Content>
        <div className="grid grid-flow-row-dense grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {themesList().map((theme) => {
            const selected =
              settings?.__typename === "Setting" ? settings.theme : "minimal";
            return (
              <div
                className={classNames(
                  "relative max-w-sm rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800"
                )}
              >
                <Image
                  className="rounded-t-lg"
                  src={theme.image}
                  height={380}
                  width={380}
                  alt=""
                />
                <div
                  className={classNames(
                    "absolute top-0 left-0 rounded-sm bg-green-700 p-1 px-2 text-xs font-bold uppercase leading-3 text-white",
                    {
                      hidden: !(selected === theme.value),
                    }
                  )}
                >
                  Selected
                </div>

                <div className="p-4">
                  <h5 className="mb-2 text-md font-bold tracking-tight text-gray-900 dark:text-white">
                    {theme.label}
                  </h5>

                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    {theme.description}
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => updateSettings({ theme: theme.value })}
                    className="flex items-center gap-1"
                  >
                    Apply
                    <AiOutlineArrowRight />
                  </Button>
                </div>
              </div>
            );
          })}
          {/* <RadioGroup
          label="Layout Style"
          items={themes()}
          selected={settings.theme ?? "minimal"}
          onChange={(item) => updateSettings({ theme: item.value })}
        /> */}
        </div>
      </Content>
    </>
  );
};

export default Themes;