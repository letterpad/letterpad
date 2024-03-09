"use client";
import { useParams } from "next/navigation";

import { useGetSettings } from "@/app/settings/_feature/api.client";
import { PageType } from "@/graphql/types";

import { useGetPost } from "./api.client";
import { Header } from "./components/header";
import { Creatives } from "./views/creatives";
import { DefaultPost } from "./views/default";

export const Feature = () => {
  const { postId } = useParams();

  const { data: post, fetching: loading } = useGetPost({ id: String(postId) });
  const { data: settings } = useGetSettings();

  if (loading) return <div></div>;
  return (
    <div style={{ minHeight: "100vh" }}>
      <title>Editing - {post?.title.replace(/(<([^>]+)>)/g, "")}</title>

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
