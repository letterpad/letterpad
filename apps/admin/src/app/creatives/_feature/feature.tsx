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
} from "@/__generated__/__types__";
import { usePostsQuery } from "@/__generated__/queries/queries.graphql";
import Filters from "@/app/posts/_feature/filters";
import { creativesColumns } from "@/app/posts/_feature/header";

import { useUpdatePost } from "../../post/[postId]/_feature/api.client";
import { DEFAULT_FILTERS } from "../../posts/_feature/constants";

export const Feature = () => {
  const [filters, setFilters] = useState<PostsFilters>({
    ...DEFAULT_FILTERS,
    type: PostTypes.Page,
  });
  const [{ data, fetching: loading, error }] = usePostsQuery({
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
        onChange={(_filters) => {
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
