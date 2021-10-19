import { Layout } from "antd";
import withAuthCheck from "@/hoc/withAuth";
import ErrorMessage from "@/components/ErrorMessage";
import Head from "next/head";
import Header from "@/components/post/components/header";
import { usePostContext } from "@/components/post/context";

function Post({ children }) {
  const { post, error } = usePostContext();

  if (!post || post.__typename !== "Post") {
    return <ErrorMessage title="Error" description={error} />;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Head>
        <title>Editing - {post.title}</title>
      </Head>
      <Header />
      {children}
    </Layout>
  );
}

export default withAuthCheck(Post);
