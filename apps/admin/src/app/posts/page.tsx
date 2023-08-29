import Head from "next/head";
import React from "react";

import { Content } from "@/components/client-wrapper";
import { Header } from "@/components/posts/header";

import { PostTypes } from "@/__generated__/__types__";

import { Feature } from "../../features/posts/feature";

async function Posts() {
  return (
    <>
      <Head>
        <title>Posts</title>
      </Head>
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
