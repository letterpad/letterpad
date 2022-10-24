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

import { PageType } from "@/graphql/types";

const TryCreatives = () => {
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
    if (value === "0") {
    }

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
      <div className="flex items-center justify-between py-4">
        <h1 className="flex justify-start p-4 text-xl font-bold">
          Creatives Playground
        </h1>
        <div className="flex h-16 justify-end gap-2 p-4 md:gap-4">
          <EditSwitch />
          <select onChange={loadCreative}>
            <option value="0">Select</option>
            <option value="new">New</option>
            <option value="intro">Intro</option>
            <option value="portfolio">Creative</option>
            <option value="wedding">Wedding</option>
            <option value="painting">Painting</option>
          </select>
          <button
            className="btn-success button"
            onClick={() => {
              router.push("/register");
            }}
          >
            Register
          </button>
          <ThemeSwitcher />
        </div>
      </div>
      <Layout type={PageType.StoryBuilder} editable={false} />
    </>
  );
};
TryCreatives.isPublic = true;

export default TryCreatives;
