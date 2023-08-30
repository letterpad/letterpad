"use client";

import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";
import { Table } from "ui";

import { postsStyles } from "@/components/posts.css";

import {
  PostsFilters,
  PostStatusOptions,
  SortBy,
} from "@/__generated__/__types__";
import { LetterpadContext } from "@/context/LetterpadProvider";
import {
  isIntroDismissed,
  setIntroDimissed,
} from "@/features/home/components/visibility";
import { postsColumns } from "@/features/posts/header";

import { useGetPosts } from "./api.client";
import Filters from "./filters";
import { useUpdatePost } from "../post/api.client";

export const Feature = () => {
  const router = useRouter();
  const [filters, setFilters] = useState<PostsFilters>({
    sortBy: SortBy["Desc"],
    status: [PostStatusOptions.Published, PostStatusOptions.Draft],
  });
  const { data, refetch, fetching } = useGetPosts(filters);
  const { updatePost } = useUpdatePost();
  const setting = useContext(LetterpadContext);

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

  return (
    <>
      <Filters
        onChange={(filters) => {
          refetch();
        }}
        filters={filters}
        setFilters={setFilters}
      />
      <Table
        columns={postsColumns({ changeStatus })}
        dataSource={data?.map((item) => ({ ...item, key: item.id }))}
        loading={fetching}
        onRowClick={(row) => router.push("/post/" + row.id)}
      />
      <style jsx>{postsStyles}</style>
    </>
  );
};
