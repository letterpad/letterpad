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
import { TagsProvider } from "@/components/tags/context";
import { useContext } from "react";
import { LetterpadContext } from "@/context/LetterpadProvider";

const { Content } = Layout;

function Posts() {
  const router = useRouter();
  const { loading, data, error, refetch } = usePostsQuery();
  const setting = useContext(LetterpadContext);
  if (error) return <ErrorMessage description={error} title="Error" />;
  const source = data?.posts.__typename === "PostsNode" ? data.posts.rows : [];
  const totalCount =
    data?.posts.__typename === "PostsNode" ? data.posts.count : 0;

  if (!setting?.intro_dismissed) {
    if (!localStorage.intro_dismissed) {
      localStorage.intro_dismissed = true;
      router.push("/home");
      return null;
    }
  }

  const handleChange = (p) => {
    refetch({
      filters: {
        page: p.current,
      },
    });
  };
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
          <TagsProvider>
            <Filters onChange={(filters) => refetch({ filters })} />
          </TagsProvider>
          <Table
            columns={postsColumns}
            dataSource={source.map((item) => ({ ...item, key: item.id }))}
            loading={loading}
            onRow={(row) => ({
              onClick: () => router.push("/post/" + row.id),
            })}
            onChange={handleChange}
            pagination={{
              hideOnSinglePage: true,
              total: totalCount - 10, // total count returned from backend
            }}
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
