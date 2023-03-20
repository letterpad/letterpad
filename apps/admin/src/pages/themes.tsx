import classNames from "classnames";
import Head from "next/head";
import Image from "next/image";
import { Button, Content, PageHeader, RadioGroup } from "ui";

import { useUpdateSettings } from "@/hooks/useUpdateSettings";

import { SettingsFragmentFragment } from "@/__generated__/src/graphql/queries/queries.graphql";

import { themes as themesList } from "../components/themes/themes";

interface Props {
  settings: SettingsFragmentFragment;
}

const Themes = ({ settings }) => {
  const { updateSettings } = useUpdateSettings();
  return (
    <>
      <Head>
        <title>Themes</title>
      </Head>
      <PageHeader className="site-page-header" title="Tags">
        <span className="help-text">
          Select the theme you want to use for your site. Remember that few
          themes might not have all the features that are available.
        </span>
      </PageHeader>
      <Content>
        <div className="grid grid-flow-row-dense grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {themesList().map((theme) => {
            const selected = settings.theme ?? "minimal";
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
                  >
                    Apply{" "}
                    <svg
                      aria-hidden="true"
                      className="ml-2 -mr-1 h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
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
