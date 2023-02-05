import classNames from "classnames";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { Content, Table, useResponsiveLayout } from "ui";

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
import { usePostsQuery } from "@/__generated__/queries/queries.graphql";
import { LetterpadContext } from "@/context/LetterpadProvider";

function Posts() {
  const router = useRouter();
  const { loading, data, error, refetch } = usePostsQuery({
    variables: { filters: { sortBy: SortBy.Desc } },
  });
  const { isDesktop } = useResponsiveLayout();
  const { updatePost } = useUpdatePost();
  const setting = useContext(LetterpadContext);
  const [filters, setFilters] = useState<PostsFilters>({
    sortBy: SortBy["Desc"],
    status: [PostStatusOptions.Published, PostStatusOptions.Draft],
  });
  const source = data?.posts.__typename === "PostsNode" ? data.posts.rows : [];

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
        <TagsProvider>
          <Filters
            onChange={(filters) => {
              refetch({ filters: { ...filters, type: PostTypes.Post } });
            }}
            filters={filters}
            setFilters={setFilters}
          />
        </TagsProvider>
        <Table
          columns={postsColumns({ changeStatus, isDesktop })}
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
