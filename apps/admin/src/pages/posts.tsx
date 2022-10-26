import { Layout } from "antd";
import { Alert } from "antd";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import React from "react";
import { useContext } from "react";

import { postsStyles } from "@/components/posts.css";

import ErrorMessage from "@/components/ErrorMessage";
import Filters from "@/components/filters";
import {
  isIntroDismissed,
  setIntroDimissed,
} from "@/components/home/visibility";
import { postsColumns } from "@/components/posts";
import { Header } from "@/components/posts/header";
import { TagsProvider } from "@/components/tags/context";
import { Table } from "@/components_v2/table";

import { PostTypes, SortBy } from "@/__generated__/__types__";
import { usePostsQuery } from "@/__generated__/queries/queries.graphql";
import { LetterpadContext } from "@/context/LetterpadProvider";
import { EventAction, track } from "@/track";

const { Content } = Layout;

function Posts({ readOnly }: { readOnly: boolean }) {
  const router = useRouter();
  const { loading, data, error, refetch } = usePostsQuery({
    variables: { filters: { sortBy: SortBy.Desc } },
  });
  const setting = useContext(LetterpadContext);

  const source = data?.posts.__typename === "PostsNode" ? data.posts.rows : [];
  const totalCount =
    data?.posts.__typename === "PostsNode" ? data.posts.count : 0;

  React.useEffect(() => {
    if (!setting?.intro_dismissed) {
      if (!isIntroDismissed()) {
        setIntroDimissed(true);
        router.push("/home");
      }
    }
  }, [router, setting?.intro_dismissed]);

  const handleChange = (p) => {
    track({
      eventAction: EventAction.Click,
      eventCategory: "posts",
      eventLabel: "pagination",
    });
    refetch({
      filters: {
        page: p.current,
      },
    });
  };
  if (error) return <ErrorMessage description={error} title="Error" />;
  if (typeof window === "undefined") return null;
  return (
    <>
      <Head>
        <title>Posts</title>
      </Head>
      <Header type={PostTypes.Post} title="Posts">
        <span className="help-text">
          Here you will find the list of posts for your blog.
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
          <TagsProvider readOnly={readOnly}>
            <Filters onChange={(filters) => refetch({ filters })} />
          </TagsProvider>
          <Table
            columns={postsColumns}
            dataSource={source.map((item) => ({ ...item, key: item.id }))}
            loading={loading}
            onRowClick={(row) => router.push("/post/" + row.id)}
          />
        </div>
        <style jsx>{postsStyles}</style>
      </Content>
    </>
  );
}

export default Posts;

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
