import FileExplorer from "@/components/file-explorer";
import withAuthCheck from "@/hoc/withAuth";
import ErrorMessage from "@/components/ErrorMessage";
import Title from "@/components/post/components/title";
import { Container } from "@/components/post";
import { PostProvider, usePostContext } from "../../components/post/context";
import { PostContextType } from "@/components/post/types";
import Layout from "@/components/post/components/layout";
import Editor from "@/components/post/components/editor";
import { insertImageUrlInEditor } from "@/components/post/helpers";

function Post() {
  return (
    <PostProvider>
      <Layout>
        <Component />
      </Layout>
    </PostProvider>
  );
}

export default withAuthCheck(Post);

const Component = () => {
  const { post, error, onFileExplorerClose, fileExplorerOpen, helpers } =
    usePostContext() as PostContextType;

  if (!post || post.__typename !== "Post") {
    return <ErrorMessage title="Error" description={error} />;
  }
  return (
    <Container>
      <Title
        title={post.title}
        onEnter={() => helpers?.getEditorRef().editor.focus()}
      />
      <Editor text={post.md_draft || post.md} />
      <FileExplorer
        multi={true}
        isVisible={fileExplorerOpen}
        handleCancel={onFileExplorerClose}
        onInsert={(images) => insertImageUrlInEditor(images, helpers)}
      />
    </Container>
  );
};
