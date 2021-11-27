import withAuthCheck from "../hoc/withAuth";
import { usePostsQuery } from "@/__generated__/queries/queries.graphql";
import { PostTypes } from "@/__generated__/__types__";
import { useRouter } from "next/router";
import { Layout, Table } from "antd";
import CustomLayout from "@/components/layouts/Layout";
import ErrorMessage from "@/components/ErrorMessage";
import Filters from "@/components/filters";
import Head from "next/head";
import { postsStyles } from "@/components/posts.css";
import { columns } from "@/components/posts";
import { Header } from "@/components/posts/header";

const { Content } = Layout;

function Pages() {
  const { loading, data, error, refetch } = usePostsQuery({
    variables: { filters: { type: PostTypes.Page } },
  });
  const router = useRouter();

  if (error) {
    return <ErrorMessage description={error} title="Error" />;
  }
  const source = data?.posts.__typename === "PostsNode" ? data.posts.rows : [];
  return (
    <>
      <Head>
        <title>Pages</title>
      </Head>
      <Header type={PostTypes.Page} title="Pages">
        Here you will find the list of pages for your blog.
      </Header>
      <Content>
        <div className="site-layout-background" style={{ padding: 24 }}>
          <Filters
            showTags={false}
            onChange={(filters) => {
              refetch({ filters: { ...filters, type: PostTypes.Page } });
            }}
          />
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
