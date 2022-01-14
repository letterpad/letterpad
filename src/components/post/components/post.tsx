import { useEffect, useState } from "react";
import { Layout, Row } from "antd";
import withAuthCheck from "@/hoc/withAuth";
import ErrorMessage from "@/components/ErrorMessage";
import Head from "next/head";
import Header from "@/components/post/components/header";
import { usePostContext } from "@/components/post/context";
import FileExplorer from "@/components/file-explorer";
import Title from "@/components/post/components/title";
import Editor from "@/components/post/components/editor";
import { insertImageUrlInEditor } from "@/components/post/helpers";
import { PostContextType } from "../types";
import { Content } from "antd/lib/layout/layout";

function Post() {
  const {
    post,
    loading,
    error,
    onFileExplorerClose,
    fileExplorerOpen,
    helpers,
  } = usePostContext() as PostContextType;

  const [count, setCount] = useState(0);

  useEffect(() => {
    if (post && post.__typename === "Post") {
      const content = post.html_draft || post.html;
      const words = content.split(" ").length;
      setCount(words);
    }
  }, [post]);

  if (!loading && post && post.__typename !== "Post") {
    return <ErrorMessage title="Error" description={error} />;
  }
  const content = post?.html_draft || post?.html;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Head>
        <title>Editing - {post?.title}</title>
      </Head>
      <Header />
      <Content style={{ margin: "24px 16px 0" }}>
        <div style={{ maxWidth: 660, margin: "auto" }}>
          {loading ? (
            ""
          ) : (
            <div>
              <Row justify="center" style={{ paddingBottom: 20 }}>
                {post?.updatedAt}
              </Row>
              <Title onEnter={() => helpers?.getEditorRef().editor.focus()} />
              <Editor text={content ?? ""} />
              <div
                style={{
                  position: "fixed",
                  bottom: 10,
                  left: 10,
                }}
              >
                {count} words
              </div>
              <FileExplorer
                multi={true}
                isVisible={fileExplorerOpen}
                handleCancel={onFileExplorerClose}
                onInsert={(images) => insertImageUrlInEditor(images, helpers)}
              />
            </div>
          )}
        </div>
      </Content>
    </Layout>
  );
}

export default withAuthCheck(Post);
