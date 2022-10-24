import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";

import { Layout } from "@/components/builder";
import {
  BuilderContext,
  useBuilderContext,
} from "@/components/builder/context";
import { EditSwitch } from "@/components/builder/toolbar/editSwitch";
import { Block } from "@/components/builder/types";
import {
  paintingData,
  portfolioData,
  weddingData,
} from "@/components/creatives-data";
import ThemeSwitcher from "@/components/theme-switcher";

import { PageType } from "@/graphql/types";

const TryBuilder = () => {
  const [data, setData] = useState<Block[]>([]);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("page_data") || "[]");
      // setData(data);
    } catch {}
  }, []);

  return (
    <BuilderContext
      data={data}
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

      default:
        setGrid([]);
    }
  };
  useEffect(() => {
    setPreview(true);
  }, [setPreview]);
  return (
    <>
      <div className="flex items-center justify-between py-4">
        <h1 className="flex justify-start p-4 text-2xl font-bold">
          Creatives Playground
        </h1>
        <div className="flex h-16 justify-end gap-0 p-4 md:gap-4">
          <ThemeSwitcher />
          <EditSwitch />
          <select onChange={loadCreative}>
            <option value="0">Select</option>
            <option value="new">New</option>
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
        </div>
      </div>
      <Layout type={PageType.StoryBuilder} editable={false} />
    </>
  );
};
TryBuilder.isPublic = true;

export default TryBuilder;
