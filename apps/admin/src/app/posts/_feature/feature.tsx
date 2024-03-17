"use client";

import { PostsFilters, PostStatusOptions } from "letterpad-graphql";
import { useHomeQueryQuery } from "letterpad-graphql/hooks";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Table } from "ui";

import { postsStyles } from "@/components/posts.css";

import { useRedirectToOnboard } from "@/components/onboard/useRedirectToOnboard";

import {
  isIntroDismissed,
  setIntroDimissed,
} from "@/app/home/_feature/components/visibility";
import { postsColumns } from "@/app/posts/_feature/header";

import { useGetPosts } from "./api.client";
import { DEFAULT_FILTERS } from "./constants";
import Filters from "./filters";
import { useUpdatePost } from "../../post/[postId]/_feature/api.client";

export const Feature = () => {
  const router = useRouter();
  const [filters, setFilters] = useState<PostsFilters>(DEFAULT_FILTERS);
  const { data, refetch, fetching } = useGetPosts(filters);
  const [{ data: homeData }] = useHomeQueryQuery();
  const { updatePost } = useUpdatePost();
  useRedirectToOnboard();

  const changeStatus = (id: string, status: PostStatusOptions) => {
    updatePost({ id, status });
  };

  React.useEffect(() => {
    if (!homeData?.settings) {
      if (!isIntroDismissed()) {
        setIntroDimissed(true);
        router.push("/home");
      }
    }
  }, [router, homeData?.settings]);

  return (
    <>
      <Filters
        onChange={() => {
          refetch();
        }}
        filters={filters}
        setFilters={setFilters}
      />
      <Table
        columns={postsColumns({ changeStatus })}
        dataSource={data}
        loading={fetching}
        onRowClick={(row) => router.push("/post/" + row.id)}
      />
      <style jsx>{postsStyles}</style>
    </>
  );
};
