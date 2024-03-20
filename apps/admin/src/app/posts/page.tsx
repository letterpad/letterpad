import { PostTypes } from "letterpad-graphql";
import React from "react";

import { Content } from "@/components/client-wrapper";

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
