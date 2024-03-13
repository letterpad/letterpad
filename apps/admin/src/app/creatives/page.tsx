import { PostTypes } from "graphql-letterpad/dist/graphql";

import { Content } from "@/components/client-wrapper";

import { Header } from "@/app/posts/_feature/header/header";

import { Feature } from "./_feature";

function Pages() {
  return (
    <>
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
