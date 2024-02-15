import React from "react";

import { Content } from "@/components/client-wrapper";

import { PostTypes } from "@/__generated__/__types__";
import { Header } from "@/app/posts/_feature/header/header";

import { Feature } from "./_feature/feature";

async function Posts() {
  return (
    <>
      <Header type={PostTypes.Post} title="Posts">
        <span className="help-text">
          Here you will find the list of posts for your blog.
        </span>
      </Header>
      <Content>
        <Feature />
      </Content>
    </>
  );
}

export default Posts;
