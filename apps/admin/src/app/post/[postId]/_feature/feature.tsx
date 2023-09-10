"use client";
import Head from "next/head";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";

import { InputUpdatePost, PostStatusOptions } from "@/__generated__/__types__";
import { PageType } from "@/graphql/types";
import { debounce } from "@/shared/utils";

import { useGetPost, useUpdatePost } from "./api.client";
import { Header } from "./components/header";
import { WordCount } from "./components/wordCount";
import { usePostContext } from "./context";
import { useActivateUpdateAllowed } from "./hooks";
import { Creatives } from "./views/creatives";
import { DefaultPost } from "./views/default";
import { useGetSettings } from "../../../settings/_feature/api.client";

export const Feature = () => {
  const { postId } = useParams();

  const { data: post, fetching: loading } = useGetPost({ id: Number(postId) });
  const { data: settings } = useGetSettings();
  const { updatePost } = useUpdatePost();
  const allowed = useActivateUpdateAllowed();

  const debounceUpdatePostAPI = useMemo(
    () => debounce(updatePost, 1000),
    [updatePost]
  );

  const updatePostWithDebounce = useCallback(
    (props: InputUpdatePost) => {
      const id = Number(postId);
      let change: InputUpdatePost = { ...props, id };
      if (props.version) {
        const stats = WordCount.getStats();
        change = {
          version: props.version,
          stats,
          id,
        };
      }
      allowed && debounceUpdatePostAPI(change);
    },
    [debounceUpdatePostAPI, postId, allowed]
  );

  if (loading) return <div></div>;
  return (
    <div style={{ minHeight: "100vh" }}>
      <Head>
        <title>Editing - {post?.title.replace(/(<([^>]+)>)/g, "")}</title>
      </Head>
      {post && <Header post={post} />}
      {post?.page_type === PageType["Default"] && (
        <DefaultPost
          settings={settings}
          post={post}
          loading={loading}
          onEditorChange={updatePostWithDebounce}
        />
      )}
      {post?.page_type === PageType["Story Builder"] && (
        <Creatives post={post} />
      )}
    </div>
  );
};
