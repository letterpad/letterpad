import classNames from "classnames";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import { HiPlus } from "react-icons/hi";
import { RiUnsplashFill } from "react-icons/ri";
import {
  BuilderContext,
  Layout as LayoutBuilder,
  PostTitlePlaceholder,
} from "ui";

import { useUpdatePost } from "@/hooks/useUpdatePost";

import ErrorMessage from "@/components/ErrorMessage";
import { FileExplorer } from "@/components/file-explorer";
import { usePostContext } from "@/components/post";
import Editor from "@/components/post/components/editor";
import Header from "@/components/post/components/header";
import { Title } from "@/components/post/components/title";
import { Upload } from "@/components/upload";

import { PostStatusOptions, PostTypes } from "@/__generated__/__types__";
import { usePostQuery } from "@/__generated__/queries/queries.graphql";
import { CreativesHead } from "@/creatives";
import { PageType } from "@/graphql/types";
import { debounce } from "@/shared/utils";

import { WordCount } from "./wordCount";
import { PostContextType } from "../types";

export const Post = () => {
  const router = useRouter();
  const { updatePostAPI, updateLocalState, updatePost } = useUpdatePost();
  const { postId } = router.query;
  const { data, loading, error } = usePostQuery({
    variables: { filters: { id: Number(postId) } },
  });

  const debounceUpdatePostAPI = useMemo(
    () => debounce((data) => updatePostAPI(data), 500),
    [updatePostAPI]
  );

  const { helpers } = usePostContext() as PostContextType;

  const post = data?.post.__typename === "Post" ? data.post : undefined;

  let content = post?.html;
  const id = post?.id;
  const status = post?.status;

  const onEditorChange = useCallback(
    (html: string, id?: number) => {
      if (!id) return;
      const stats = WordCount.getStats();
      if (status === PostStatusOptions.Draft) {
        debounceUpdatePostAPI({ id, html_draft: html, stats });
        updateLocalState({ id, html_draft: html, stats });
      } else if (status === PostStatusOptions.Published) {
        debounceUpdatePostAPI({ id: id, html, stats, html_draft: "" });
        updateLocalState({ id: id, html, stats, html_draft: "" });
      }
    },
    [debounceUpdatePostAPI, status, updateLocalState]
  );

  if (!loading && data && data.post.__typename !== "Post") {
    return <ErrorMessage title="Error" description={error} />;
  }

  if (
    post?.status === PostStatusOptions.Draft ||
    post?.status === PostStatusOptions.Trashed
  ) {
    content = post?.html_draft;
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      <Head>
        <title>Editing - {post?.title}</title>
      </Head>
      {post && <Header post={post} />}

      {(post?.type == PostTypes.Page || post?.type == PostTypes.Post) &&
        post.page_type === PageType.Default && (
          <>
            <div className="content">
              {loading ? (
                <PostTitlePlaceholder />
              ) : (
                <Title
                  onEnter={() => helpers?.focus()}
                  title={post?.title || ""}
                  postId={post?.id}
                />
              )}
              <div
                className={classNames("relative", {
                  "my-10 mb-10": post.cover_image.src,
                })}
              >
                <Upload
                  className="bg-transparent text-slate-300 hover:text-slate-400 dark:bg-transparent dark:hover:text-slate-500"
                  url={post.cover_image.src || ""}
                  emptyIcon={
                    <>
                      <HiPlus size={18} />
                      <Link href="#aa">Add a cover image</Link>
                      <RiUnsplashFill size={18} />
                    </>
                  }
                  onSuccess={([res]) => {
                    updatePost({
                      id: post.id,
                      cover_image: {
                        src: res?.src,
                        width: res.size?.width,
                        height: res.size?.height,
                      },
                    });
                  }}
                />
              </div>
              <Editor
                loading={loading}
                text={content ?? ""}
                onChange={(html) => {
                  onEditorChange(html, id);
                }}
              />
            </div>
            <WordCount />
          </>
        )}

      {!loading && post?.page_type === PageType["Story Builder"] && (
        <div className="my-10">
          <Title
            onEnter={() => helpers?.focus()}
            title={post?.title || ""}
            postId={post?.id}
          />
          <BuilderContext
            data={JSON.parse(post.page_data as string).rows}
            onSave={(page_data) =>
              debounceUpdatePostAPI({
                id: id,
                page_data: JSON.stringify({ rows: page_data }),
              })
            }
            FileExplorer={FileExplorer}
          >
            <LayoutBuilder head={<CreativesHead />} />
          </BuilderContext>
        </div>
      )}
    </div>
  );
};
