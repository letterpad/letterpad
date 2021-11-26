import { Setting } from "@/__generated__/__types__";
import { NextComponentType, NextPageContext } from "next";
import { ComponentType } from "react";
import Head from "next/head";
import { basePath } from "@/constants";

interface IProps {
  Layout: ComponentType<{ settings: Setting }>;
  settings: Setting;
  Component: NextComponentType<NextPageContext, any, {}>;
  props: any;
}
const Main = ({ Layout, settings, Component, props }: IProps) => {
  return (
    <>
      <Head>
        <link rel="icon" href={basePath + "/uploads/logo.png"} />
      </Head>

      <Layout settings={settings}>
        <Component {...props} settings={settings} />
      </Layout>
    </>
  );
};

export default Main;
