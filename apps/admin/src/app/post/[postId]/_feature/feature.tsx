"use client";
import Head from "next/head";
import { useParams } from "next/navigation";

import { PageType } from "@/graphql/types";

import { useGetPost } from "./api.client";
import { Header } from "./components/header";
import { Creatives } from "./views/creatives";
import { DefaultPost } from "./views/default";
import { useGetSettings } from "../../../settings/_feature/api.client";

export const Feature = () => {
  const { postId } = useParams();

  const { data: post, fetching: loading } = useGetPost({ id: Number(postId) });
  const { data: settings } = useGetSettings();

  if (loading) return <div></div>;
  return (
    <div style={{ minHeight: "100vh" }}>
      <Head>
        <title>Editing - {post?.title.replace(/(<([^>]+)>)/g, "")}</title>
      </Head>
      {post && <Header post={post} />}
      {post?.page_type === PageType["Default"] && (
        <DefaultPost settings={settings} post={post} loading={loading} />
      )}
      {post?.page_type === PageType["Story Builder"] && (
        <Creatives post={post} />
      )}
    </div>
  );
};
