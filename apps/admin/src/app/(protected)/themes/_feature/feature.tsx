"use client";

import classNames from "classnames";
import Image from "next/image";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Button } from "ui/dist/index.mjs";

import { themes as themesList } from "./components/themes";
import {
  useGetSettings,
  useUpdateSettings,
} from "../../settings/_feature/api.client";

export const Feature = () => {
  const { data } = useGetSettings();
  const { updateSettings } = useUpdateSettings();
  return (
    <>
      {themesList().map((theme) => {
        const selected = data ? data.theme : "minimal";
        return (
          <div
            className={classNames(
              "relative max-w-md rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 flex flex-col dark:bg-gray-800"
            )}
            key={theme.label}
          >
            <Image
              className="rounded-t-lg object-cover"
              src={theme.image}
              height={380}
              width={380}
              alt=""
            />
            <div
              className={classNames(
                "absolute left-0 top-0 rounded-sm bg-green-700 p-1 px-2 text-xs font-bold uppercase leading-3 text-white",
                {
                  hidden: !(selected === theme.value),
                }
              )}
            >
              Selected
            </div>

            <div className="p-4 flex flex-col h-full">
              <h5 className="mb-2 text-md font-bold tracking-tight text-gray-900 dark:text-white">
                {theme.label}
              </h5>

              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 flex-1 flex">
                {theme.description}
              </p>
              <Button
                variant="primary"
                onClick={() =>
                  updateSettings(
                    { options: { theme: theme.value } },
                    { optimistic: true }
                  )
                }
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
    </>
  );
};
