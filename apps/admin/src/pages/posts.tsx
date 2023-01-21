import Head from "next/head";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { Content, Table } from "ui";

import { postsStyles } from "@/components/posts.css";

import { useUpdatePost } from "@/hooks/useUpdatePost";

import ErrorMessage from "@/components/ErrorMessage";
import Filters from "@/components/filters";
import {
  isIntroDismissed,
  setIntroDimissed,
} from "@/components/home/visibility";
import { postsColumns } from "@/components/posts";
import { Header } from "@/components/posts/header";
import { TagsProvider } from "@/components/tags/context";

import {
  PostsFilters,
  PostStatusOptions,
  PostTypes,
  SortBy,
} from "@/__generated__/__types__";
import {
  usePostsQuery,
  useStatsQuery,
} from "@/__generated__/queries/queries.graphql";
import { LetterpadContext } from "@/context/LetterpadProvider";

function Posts() {
  const router = useRouter();
  const { loading, data, error, refetch } = usePostsQuery({
    variables: { filters: { sortBy: SortBy.Desc } },
  });
  const stats = useStatsQuery();
  const { updatePost } = useUpdatePost();
  const setting = useContext(LetterpadContext);
  const [filters, setFilters] = useState<PostsFilters>({
    sortBy: SortBy["Desc"],
  });
  const source = data?.posts.__typename === "PostsNode" ? data.posts.rows : [];
  const statsData =
    stats.data?.stats?.__typename === "Stats"
      ? stats.data.stats.posts
      : { published: 0, drafts: 0, trashed: 0 };

  const changeStatus = (id: number, status: PostStatusOptions) => {
    updatePost({ id, status });
  };

  React.useEffect(() => {
    if (!setting?.intro_dismissed) {
      if (!isIntroDismissed()) {
        setIntroDimissed(true);
        router.push("/home");
      }
    }
  }, [router, setting?.intro_dismissed]);

  if (error)
    return (
      <ErrorMessage
        description={error}
        title="Could not load posts. Refresh the page to try again"
      />
    );
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
        <div className="flex flex-row items-center justify-between">
          <div className="hidden flex-row gap-2 text-sm lg:flex">
            <Badge label="Published" count={statsData.published} />
            <Badge label="Drafts" count={statsData.drafts} />
            <Badge label="Trashed" count={2} />
          </div>
          <div className="grid grid-cols-3 items-center gap-2">
            <TagsProvider>
              <Filters
                onChange={(filters) => {
                  refetch({ filters: { ...filters, type: PostTypes.Post } });
                }}
                filters={filters}
                setFilters={setFilters}
              />
            </TagsProvider>
          </div>
        </div>
        <Table
          columns={postsColumns({ changeStatus })}
          dataSource={source.map((item) => ({ ...item, key: item.id }))}
          loading={loading}
          onRowClick={(row) => router.push("/post/" + row.id)}
        />
        <style jsx>{postsStyles}</style>
      </Content>
    </>
  );
}

export default Posts;

const Badge = ({ label, count }) => {
  return (
    <span className="flex items-center gap-2 rounded-md bg-slate-100 px-2 py-1  text-slate-500 dark:bg-slate-800 dark:text-slate-400">
      {label}
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-xs dark:bg-slate-900">
        {count}
      </span>
    </span>
  );
};
