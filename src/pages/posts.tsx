import { usePostsQuery } from "@/__generated__/queries/queries.graphql";
import { PostTypes } from "@/__generated__/__types__";
import { Layout, Table } from "antd";
import Filters from "@/components/filters";
import CustomLayout from "@/components/layouts/Layout";
import { useRouter } from "next/router";
import withAuthCheck from "../hoc/withAuth";
import ErrorMessage from "@/components/ErrorMessage";
import Head from "next/head";
import { postsStyles } from "@/components/posts.css";
import { postsColumns } from "@/components/posts";
import { Header } from "@/components/posts/header";
import Loading from "@/components/loading";

const { Content } = Layout;

function Posts() {
  const router = useRouter();
  const { loading, data, error } = usePostsQuery();

  if (loading) return <Loading />;

  if (error) return <ErrorMessage description={error} title="Error" />;
  const source = data?.posts.__typename === "PostsNode" ? data.posts.rows : [];

  return (
    <>
      <Head>
        <title>Posts</title>
      </Head>
      <Header type={PostTypes.Post} title="Posts">
        Here you will find the list of posts for your blog.
      </Header>
      <Content>
        <div className="site-layout-background" style={{ padding: 16 }}>
          <Filters />
          <Table
            columns={postsColumns}
            dataSource={source}
            loading={loading}
            onRow={(row) => ({
              onClick: () => router.push("/post/" + row.id),
            })}
          />
        </div>
        <style jsx>{postsStyles}</style>
      </Content>
    </>
  );
}

const PostsWithAuth = withAuthCheck(Posts);
PostsWithAuth.layout = CustomLayout;
export default PostsWithAuth;
