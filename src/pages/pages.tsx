import withAuthCheck from "../hoc/withAuth";
import { PostsQuery } from "@/__generated__/queries/queries.graphql";
import { PostTypes } from "@/__generated__/__types__";
import { useRouter } from "next/router";
import { Layout, Table } from "antd";
const { Content } = Layout;
import CustomLayout from "@/components/layouts/Layout";
import { useEffect, useState } from "react";
import ErrorMessage from "@/components/ErrorMessage";
import Filters from "@/components/filters";
import Head from "next/head";
import { postsStyles } from "@/components/posts.css";
import { columns } from "@/components/posts";
import { fetchPosts } from "@/components/posts/api";
import { Header } from "@/components/posts/header";

function Pages() {
  const [loading, setLoading] = useState(true);
  const [postsNode, setPostsNode] = useState<PostsQuery["posts"]>({
    count: 0,
    rows: [],
  });

  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    getPages();
  }, []);

  const getPages = async () => {
    try {
      const posts = await fetchPosts(PostTypes.Page);
      setLoading(false);
      if (posts) setPostsNode(posts);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  if (error) {
    return <ErrorMessage description={error} title="Error" />;
  }
  const source = postsNode.__typename === "PostsNode" ? postsNode.rows : [];
  return (
    <>
      <Head>
        <title>Pages</title>
      </Head>
      <Header type={PostTypes.Page} title="Pages" />
      <Content>
        <div className="site-layout-background" style={{ padding: 16 }}>
          <Filters showTags={false} />
          <Table
            columns={columns}
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

const PagesWithAuth = withAuthCheck(Pages);
PagesWithAuth.layout = CustomLayout;
export default PagesWithAuth;
