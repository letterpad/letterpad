import Head from "next/head";

import { Content } from "@/components/client-wrapper";

import { PostTypes } from "@/__generated__/__types__";
import { Header } from "@/app/posts/_feature/header/header";

import { Feature } from "./_feature";

function Pages() {
  return (
    <>
      <Head>
        <title>Creatives</title>
      </Head>
      <Header type={PostTypes.Page} title="Creatives">
        <div className="flex flex-row items-center justify-start">
          <span className="help-text">
            Creatives add more customisation to your site. Create portfolios,
            photo stories, write a picture book etc.
          </span>
          <a
            href="/try-creatives"
            target="_blank"
            rel="noreferrer"
            className="ml-2 text-blue-500"
          >
            Demo
          </a>
        </div>
      </Header>
      <Content>
        <Feature />
      </Content>
    </>
  );
}
export default Pages;
