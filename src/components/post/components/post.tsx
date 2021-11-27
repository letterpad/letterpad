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
  const { post, error, onFileExplorerClose, fileExplorerOpen, helpers } =
    usePostContext() as PostContextType;

  if (!post || post.__typename !== "Post") {
    return <ErrorMessage title="Error" description={error} />;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Head>
        <title>Editing - {post.title}</title>
      </Head>
      <Header />
      <Content style={{ margin: "24px 16px 0" }}>
        <div style={{ maxWidth: 660, margin: "auto" }}>
          <Row justify="center" style={{ paddingBottom: 20 }}>
            {post.updatedAt}
          </Row>
          <Title onEnter={() => helpers?.getEditorRef().editor.focus()} />
          <Editor text={post.html_draft || post.html} />
          <FileExplorer
            multi={true}
            isVisible={fileExplorerOpen}
            handleCancel={onFileExplorerClose}
            onInsert={(images) => insertImageUrlInEditor(images, helpers)}
          />
        </div>
      </Content>
    </Layout>
  );
}

export default withAuthCheck(Post);
