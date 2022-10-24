import { Layout } from "antd";
import { Content } from "antd/lib/layout/layout";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";

import { useUpdatePost } from "@/hooks/useUpdatePost";

import { Layout as LayoutBuilder } from "@/components/builder";
import { BuilderContext } from "@/components/builder/context";
import ErrorMessage from "@/components/ErrorMessage";
import Editor from "@/components/post/components/editor";
import Header from "@/components/post/components/header";
import Title from "@/components/post/components/title";
import { usePostContext } from "@/components/post/context";

import { PostStatusOptions, PostTypes } from "@/__generated__/__types__";
import { usePostQuery } from "@/__generated__/queries/queries.graphql";
import { PageType } from "@/graphql/types";
import { debounce } from "@/shared/utils";

import PostDate from "./postDate";
import WordCount from "./wordCount";
import { PostContextType } from "../types";

function Post() {
  const router = useRouter();
  const { updatePostAPI, updateLocalState } = useUpdatePost();
  const { postId } = router.query;
  const { data, loading, error } = usePostQuery({
    variables: { filters: { id: Number(postId) } },
  });

  const debounceUpdatePostAPI = useMemo(
    () => debounce((data) => updatePostAPI(data), 500),
    [updatePostAPI],
  );

  const { helpers } = usePostContext() as PostContextType;

  const post = data?.post.__typename === "Post" ? data.post : undefined;
  let content = post?.html;
  const id = post?.id;
  const status = post?.status;

  const onEditorChange = useCallback(
    (html: string) => {
      if (!id) return;
      if (status === PostStatusOptions.Draft) {
        debounceUpdatePostAPI({ id, html_draft: html });
        updateLocalState({ id, html_draft: html });
      } else if (status === PostStatusOptions.Published) {
        debounceUpdatePostAPI({ id: id, html });
        updateLocalState({ id: id, html });
      }
    },
    [debounceUpdatePostAPI, id, status, updateLocalState],
  );

  if (!loading && data && data.post.__typename !== "Post") {
    return <ErrorMessage title="Error" description={error} />;
  }

  if (
    post?.status === PostStatusOptions.Draft ||
    post?.status === PostStatusOptions.Trashed
  ) {
    content = post.html_draft;
  }
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Head>
        <title>Editing - {post?.title}</title>
      </Head>
      {post && <Header post={post} />}

      {!loading &&
        (post?.type == PostTypes.Page || post?.type == PostTypes.Post) &&
        post.page_type === PageType.Default && (
          <Content style={{ margin: "24px 16px 0" }}>
            <div style={{ maxWidth: 660, margin: "0 auto" }}>
              <PostDate date={post?.updatedAt} />
              <Title
                onEnter={() => helpers?.focus()}
                title={post?.title || ""}
                postId={post?.id}
              />
              <Editor text={content ?? ""} onChange={onEditorChange} />
              <WordCount text={content || ""} />
            </div>
          </Content>
        )}

      {!loading && post?.page_type === PageType.StoryBuilder && (
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
          >
            <LayoutBuilder type={post.page_type} />
          </BuilderContext>
        </div>
      )}
    </Layout>
  );
}

export default Post;
