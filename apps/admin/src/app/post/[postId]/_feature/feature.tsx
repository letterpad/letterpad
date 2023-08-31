"use client";
import Head from "next/head";
import { useParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import { PostStatusOptions } from "@/__generated__/__types__";
import { PageType } from "@/graphql/types";
import { debounce } from "@/shared/utils";

import { useGetPost, useUpdatePost } from "./api.client";
import { Header } from "./components/header";
import { WordCount } from "./components/wordCount";
import { Creatives } from "./views/creatives";
import { DefaultPost } from "./views/default";
import { useGetSettings } from "../../../settings/_feature/api.client";

export const Feature = () => {
  const { postId } = useParams();

  const { data: post, fetching: loading } = useGetPost({ id: Number(postId) });
  const { data: settings } = useGetSettings();
  const { updatePost } = useUpdatePost();

  const debounceUpdatePostAPI = useMemo(
    () => debounce((data) => updatePost(data), 500),
    [updatePost]
  );

  let content = post?.html;
  const status = post?.status;

  const onEditorChange = useCallback(
    (html: string, id?: number) => {
      if (!id) return;
      const stats = WordCount.getStats();
      if (status === PostStatusOptions.Draft) {
        debounceUpdatePostAPI({ id, html_draft: html, stats });
      } else if (status === PostStatusOptions.Published) {
        debounceUpdatePostAPI({ id: id, html, stats, html_draft: "" });
      }
    },
    [debounceUpdatePostAPI, status]
  );

  if (
    post?.status === PostStatusOptions.Draft ||
    post?.status === PostStatusOptions.Trashed
  ) {
    content = post?.html_draft;
  }
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
          onEditorChange={onEditorChange}
        />
      )}
      {post?.page_type === PageType["Story Builder"] && (
        <Creatives post={post} />
      )}
    </div>
  );
};
