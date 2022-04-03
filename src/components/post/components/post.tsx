import { Layout } from "antd";
import ErrorMessage from "@/components/ErrorMessage";
import Head from "next/head";
import Header from "@/components/post/components/header";
import { usePostContext } from "@/components/post/context";
import FileExplorer from "@/components/file-explorer";
import Title from "@/components/post/components/title";
import Editor from "@/components/post/components/editor";
import { PostContextType } from "../types";
import { Content } from "antd/lib/layout/layout";
import { insertImageInEditor } from "./commands";
import { usePostQuery } from "@/__generated__/queries/queries.graphql";
import { useRouter } from "next/router";
import PostDate from "./postDate";
import WordCount from "./wordCount";

function Post() {
  const router = useRouter();
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
  const content = post?.html_draft || post?.html;

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
              <Editor text={content ?? ""} postId={post?.id} />
              <WordCount text={post?.html_draft || post?.html || ""} />
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
