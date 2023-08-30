"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Table } from "ui";

import { postsStyles } from "@/components/posts.css";

import ErrorMessage from "@/components/ErrorMessage";

import {
  PostsFilters,
  PostStatusOptions,
  PostTypes,
  SortBy,
} from "@/__generated__/__types__";
import { usePostsQuery } from "@/__generated__/queries/queries.graphql";
import Filters from "@/features/posts/filters";
import { creativesColumns } from "@/features/posts/header";

import { useUpdatePost } from "../../features/post/api.client";

const initialFilterState = {
  sortBy: SortBy["Desc"],
  type: PostTypes.Page,
  status: [PostStatusOptions.Published, PostStatusOptions.Draft],
};

export const Feature = () => {
  const [filters, setFilters] = useState<PostsFilters>(initialFilterState);
  const [{ data, fetching: loading, error }, refetch] = usePostsQuery({
    variables: { filters },
  });
  const router = useRouter();
  const { updatePost } = useUpdatePost();
  if (error) {
    return <ErrorMessage description={error} title="Error" />;
  }
  const changeStatus = (id: number, status: PostStatusOptions) => {
    updatePost({ id, status });
  };

  const source = data?.posts.__typename === "PostsNode" ? data.posts.rows : [];
  return (
    <>
      <Filters
        showTags={false}
        showPageTypes={true}
        onChange={(filters) => {
          //   setFilters({ ...filters, type: PostTypes.Page });
          //   refetch({ filters: { ...filters, type: PostTypes.Page } });
        }}
        filters={filters}
        setFilters={setFilters}
      />

      <Table
        columns={creativesColumns({ changeStatus })}
        dataSource={source}
        loading={loading}
        onRowClick={(row) => router.push("/post/" + row.id)}
      />

      <style jsx>{postsStyles}</style>
    </>
  );
};
