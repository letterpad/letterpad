import { Layout } from "antd";
import { Alert } from "antd";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";

import { postsStyles } from "@/components/posts.css";

import ErrorMessage from "@/components/ErrorMessage";
import Filters from "@/components/filters";
import { columns } from "@/components/posts";
import { Header } from "@/components/posts/header";
import { Table } from "@/components_v2/table";

import { PostTypes, SortBy } from "@/__generated__/__types__";
import { usePostsQuery } from "@/__generated__/queries/queries.graphql";

const { Content } = Layout;

function Pages({ readOnly }: { readOnly: boolean }) {
  const { loading, data, error, refetch } = usePostsQuery({
    variables: { filters: { type: PostTypes.Page, sortBy: SortBy.Desc } },
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
        <span className="help-text">
          Here you will find the list of pages for your blog.
        </span>
      </Header>
      <Content>
        {readOnly && (
          <Alert
            message="This section is read only. You will be able to make changes, but they wont be saved."
            type="warning"
          />
        )}
        <div className="site-layout-background  px-4 py-4">
          <Filters
            showTags={false}
            showPageTypes={false}
            onChange={(filters) => {
              refetch({ filters: { ...filters, type: PostTypes.Page } });
            }}
          />
          <Table
            columns={columns}
            dataSource={source}
            loading={loading}
            onRowClick={(row) => router.push("/post/" + row.id)}
          />
        </div>
        <style jsx>{postsStyles}</style>
      </Content>
    </>
  );
}

export default Pages;

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      readOnly:
        process.env.READ_ONLY === "true" &&
        session?.user?.email === "demo@demo.com",
    },
  };
}
