import { PostsQuery } from "@/__generated__/queries/queries.graphql";
import { PostTypes } from "@/__generated__/__types__";
import { Layout, Table } from "antd";
import Filters from "@/components/filters";
const { Content } = Layout;
import CustomLayout from "@/components/layouts/Layout";
import { useRouter } from "next/router";
import withAuthCheck from "../hoc/withAuth";
import { useEffect, useState } from "react";
import ErrorMessage from "@/components/ErrorMessage";
import Head from "next/head";
import { postsStyles } from "@/components/posts.css";
import { postsColumns } from "@/components/posts";
import { fetchPosts } from "@/components/posts/api";
import { Header } from "@/components/posts/header";
import Bugsnag from "@bugsnag/js";
function Posts() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [postsNode, setPostsNode] = useState<PostsQuery["posts"]>({
    count: 0,
    rows: [],
  });

  const [error, setError] = useState("");

  useEffect(() => {
    getPosts();
    Bugsnag.notify(new Error("Another Test error"));
    Bugsnag.notify(new Error("Test error"));
  }, []);

  const getPosts = async () => {
    try {
      const posts = await fetchPosts();
      setLoading(false);
      if (posts) setPostsNode(posts);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  if (error) return <ErrorMessage description={error} title="Error" />;
  const source = postsNode.__typename === "PostsNode" ? postsNode.rows : [];

  return (
    <>
      <Head>
        <title>Posts</title>
      </Head>
      <Header type={PostTypes.Post} title="Posts" />
      <Content>
        <div
          className="site-layout-background"
          style={{ padding: 16, minHeight: "77vh" }}
        >
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
