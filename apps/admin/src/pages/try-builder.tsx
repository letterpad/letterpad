import { useState } from "react";

import { Layout } from "@/components/builder";
import {
  BuilderContext,
  useBuilderContext,
} from "@/components/builder/context";
import { EditSwitch } from "@/components/builder/toolbar/editSwitch";
import { Block } from "@/components/builder/types";
import ThemeSwitcher from "@/components/theme-switcher";

import { PageType } from "@/graphql/types";

const TryBuilder = () => {
  const [data, setData] = useState<Block[]>([]);
  return (
    <BuilderContext
      data={data}
      onSave={(newData) => {
        setData(newData);
      }}
    >
      <div className="flex justify-end p-4">
        <ThemeSwitcher />
        <EditSwitch />
      </div>
      <Builder />
    </BuilderContext>
  );
};

const Builder = () => {
  useBuilderContext();
  return <Layout type={PageType.StoryBuilder} editable={false} />;
};
TryBuilder.isPublic = true;

export default TryBuilder;
