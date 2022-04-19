import React from "react";
import { usePostsQuery } from "@/__generated__/queries/queries.graphql";
import { PostTypes } from "@/__generated__/__types__";
import { Layout, Table } from "antd";
import Filters from "@/components/filters";
import { useRouter } from "next/router";
import ErrorMessage from "@/components/ErrorMessage";
import Head from "next/head";
import { postsStyles } from "@/components/posts.css";
import { postsColumns } from "@/components/posts";
import { Header } from "@/components/posts/header";
import { TagsProvider } from "@/components/tags/context";
import { useContext } from "react";
import { LetterpadContext } from "@/context/LetterpadProvider";
import { Alert } from "antd";
import { getSession } from "next-auth/react";
import { EventAction, track } from "@/track";

const { Content } = Layout;

function Posts({ readOnly }: { readOnly: boolean }) {
  const router = useRouter();
  const { loading, data, error, refetch } = usePostsQuery();
  const setting = useContext(LetterpadContext);
  if (error) return <ErrorMessage description={error} title="Error" />;
  const source = data?.posts.__typename === "PostsNode" ? data.posts.rows : [];
  const totalCount =
    data?.posts.__typename === "PostsNode" ? data.posts.count : 0;

  React.useEffect(() => {
    if (!setting?.intro_dismissed) {
      if (!localStorage.intro_dismissed) {
        localStorage.intro_dismissed = true;
        router.push("/home");
      }
    }
  }, []);

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
        <div className="site-layout-background" style={{ padding: 16 }}>
          <TagsProvider readOnly={readOnly}>
            <Filters onChange={(filters) => refetch({ filters })} />
          </TagsProvider>
          <Table
            columns={postsColumns}
            dataSource={source.map((item) => ({ ...item, key: item.id }))}
            loading={loading}
            onRow={(row) => ({
              onClick: () => {
                router.push("/post/" + row.id);
              },
            })}
            onChange={handleChange}
            pagination={{
              hideOnSinglePage: true,
              total: totalCount, // total count returned from backend
            }}
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
