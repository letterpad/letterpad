import { Layout } from "antd";
import { Content } from "antd/lib/layout/layout";
import Head from "next/head";
import { useRouter } from "next/router";

import { useUpdatePost } from "@/hooks/useUpdatePost";

import ErrorMessage from "@/components/ErrorMessage";
import FileExplorer from "@/components/file-explorer";
import Editor from "@/components/post/components/editor";
import Header from "@/components/post/components/header";
import Title from "@/components/post/components/title";
import { usePostContext } from "@/components/post/context";

import { PostStatusOptions } from "@/__generated__/__types__";
import { usePostQuery } from "@/__generated__/queries/queries.graphql";

import { insertImageInEditor } from "./commands";
import PostDate from "./postDate";
import WordCount from "./wordCount";
import { PostContextType } from "../types";

function Post() {
  const router = useRouter();
  const { debounceUpdatePost } = useUpdatePost();
  const { postId } = router.query;
  const { data, loading, error } = usePostQuery({
    variables: { filters: { id: Number(postId) } },
  });

  const { onFileExplorerClose, fileExplorerOpen, helpers } =
    usePostContext() as PostContextType;

  if (!loading && data && data.post.__typename !== "Post") {
    return <ErrorMessage title="Error" description={error} />;
  }

  const post = data?.post.__typename === "Post" ? data.post : undefined;
  let content = post?.html;
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
      <Content style={{ margin: "24px 16px 0" }}>
        <div style={{ maxWidth: 660, margin: "auto" }}>
          {!loading && (
            <div>
              <PostDate date={post?.updatedAt} />
              <Title
                onEnter={() => helpers?.focus()}
                title={post?.title || ""}
                postId={post?.id}
              />
              <Editor
                text={content ?? ""}
                onChange={(html) => {
                  if (post?.status === PostStatusOptions.Draft) {
                    debounceUpdatePost({ id: post.id, html_draft: html });
                  } else if (post?.status === PostStatusOptions.Published) {
                    debounceUpdatePost({ id: post.id, html });
                  }
                }}
              />
              <WordCount text={content || ""} />
              <FileExplorer
                multi={true}
                isVisible={fileExplorerOpen}
                handleCancel={onFileExplorerClose}
                onInsert={(images) =>
                  helpers && insertImageInEditor(helpers, images)
                }
              />
            </div>
          )}
        </div>
      </Content>
    </Layout>
  );
}

export default Post;
