import Head from "next/head";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect } from "react";

import { Layout } from "@/components/builder";
import {
  BuilderContext,
  useBuilderContext,
} from "@/components/builder/context";
import { EditSwitch } from "@/components/builder/toolbar/editSwitch";
import {
  introData,
  paintingData,
  portfolioData,
  weddingData,
} from "@/components/creatives-data";
import ThemeSwitcher from "@/components/theme-switcher";
import { Buttonv2 } from "@/components_v2/button";

import { PageType } from "@/graphql/types";
import { EventAction, track } from "@/track";

const TryCreatives = () => {
  useEffect(() => {
    ThemeSwitcher.switch("dark");
  }, []);
  return (
    <BuilderContext
      data={[]}
      onSave={(newData) => {
        localStorage.setItem("page_data", JSON.stringify(newData));
      }}
    >
      <Builder />
    </BuilderContext>
  );
};

const Builder = () => {
  const { setPreview, setGrid } = useBuilderContext();
  const router = useRouter();

  const loadCreative = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
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
  };

  useEffect(() => {
    setPreview(true);
    setTimeout(() => {
      setGrid(introData);
    });
  }, [setGrid, setPreview]);

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
            onChange={loadCreative}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          >
            <option value="0">Select</option>
            <option value="new">New</option>
            <option value="intro">Intro</option>
            <option value="portfolio">Creative</option>
            <option value="wedding">Wedding</option>
            <option value="painting">Painting</option>
          </select>
          <EditSwitch />
          <Buttonv2
            onClick={() => {
              router.push("/register");
            }}
          >
            Register
          </Buttonv2>
          <ThemeSwitcher />
        </div>
      </div>
      <Layout type={PageType.StoryBuilder} editable={false} />
    </>
  );
};
TryCreatives.isPublic = true;

export default TryCreatives;
