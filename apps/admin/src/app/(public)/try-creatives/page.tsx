"use client";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import {
  BuilderContext,
  Button,
  EditSwitch,
  Layout,
  useBuilderContext,
} from "ui";

import { CreativesHead } from "@/components/creatives";
import {
  introData,
  paintingData,
  portfolioData,
  weddingData,
} from "@/components/creatives-data";
import { FileExplorer } from "@/components/file-explorer";
import ThemeSwitcher from "@/components/theme-switcher";

import { EventAction, track } from "@/track";

const TryCreatives = () => {
  useEffect(() => {
    ThemeSwitcher.switch("dark");
  }, []);
  return (
    <BuilderContext
      data={introData}
      onSave={(newData) => {
        localStorage.setItem("page_data", JSON.stringify(newData));
      }}
      FileExplorer={FileExplorer}
    >
      <Builder />
    </BuilderContext>
  );
};

const Builder = () => {
  const { setPreview, setGrid } = useBuilderContext();
  const [activeCreative, setActiveCreative] = useState("intro");
  const router = useRouter();

  const loadCreative = useCallback(
    (value: string) => {
      track({
        eventAction: EventAction.Click,
        eventCategory: "creatives-demo",
        eventLabel: value,
      });

      switch (value) {
        case "portfolio":
          setGrid(portfolioData);
          setPreview(true);
          break;
        case "wedding":
          setGrid(weddingData);
          setPreview(true);
          break;
        case "painting":
          setGrid(paintingData);
          setPreview(true);
          break;
        case "new":
          setGrid([]);
          setPreview(false);
          break;
        case "intro":
          setGrid(introData);
          setPreview(true);
          break;

        default:
          setGrid([]);
      }
    },
    [setGrid, setPreview]
  );

  useEffect(() => {
    setPreview(true);
    setTimeout(() => {
      loadCreative(activeCreative);
    }, 0);
  }, [activeCreative, loadCreative, setPreview]);

  return (
    <>
      <Head>
        <title>Creatives</title>
      </Head>
      <div className="mx-4 flex items-center justify-between py-4">
        <h1 className="flex justify-start p-4 text-xl font-bold">
          Creatives Playground
        </h1>
        <div className=" flex h-10 justify-end gap-2 md:gap-4">
          <select
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setActiveCreative(e.target.value)
            }
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          >
            <option value="0" selected={activeCreative === "0"}>
              Select
            </option>
            <option value="new" selected={activeCreative === "new"}>
              New
            </option>
            <option value="intro" selected={activeCreative === "intro"}>
              Intro
            </option>
            <option value="portfolio" selected={activeCreative === "portfolio"}>
              Creative
            </option>
            <option value="wedding" selected={activeCreative === "wedding"}>
              Wedding
            </option>
            <option value="painting" selected={activeCreative === "painting"}>
              Painting
            </option>
          </select>
          <EditSwitch />
          <Button
            onClick={() => {
              router.push("/register");
            }}
            size="small"
          >
            Register
          </Button>
          <ThemeSwitcher />
        </div>
      </div>
      <Layout editable={false} head={<CreativesHead />} />
    </>
  );
};
TryCreatives.isPublic = true;

export default TryCreatives;
