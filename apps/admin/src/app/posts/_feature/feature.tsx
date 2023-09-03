"use client";

import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";
import { Table } from "ui";

import { postsStyles } from "@/components/posts.css";

import { useRedirectToOnboard } from "@/components/onboard/useRedirectToOnboard";

import { PostsFilters, PostStatusOptions } from "@/__generated__/__types__";
import {
  isIntroDismissed,
  setIntroDimissed,
} from "@/app/home/_feature/components/visibility";
import { postsColumns } from "@/app/posts/_feature/header";

import { useGetPosts } from "./api.client";
import { DEFAULT_FILTERS } from "./constants";
import Filters from "./filters";
import { useUpdatePost } from "../../post/[postId]/_feature/api.client";
import { useGetSettings } from "../../settings/_feature/api.client";

export const Feature = () => {
  const router = useRouter();
  const [filters, setFilters] = useState<PostsFilters>(DEFAULT_FILTERS);
  const { data, refetch, fetching } = useGetPosts(filters);
  const { data: settings } = useGetSettings();
  const { updatePost } = useUpdatePost();
  useRedirectToOnboard();

  const changeStatus = (id: number, status: PostStatusOptions) => {
    updatePost({ id, status });
  };

  React.useEffect(() => {
    if (!settings) {
      if (!isIntroDismissed()) {
        setIntroDimissed(true);
        router.push("/home");
      }
    }
  }, [router, settings?.intro_dismissed]);

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
        // dataSource={data?.map((item) => ({ ...item, key: item.id }))}
        loading={fetching}
        onRowClick={(row) => router.push("/post/" + row.id)}
      />
      <style jsx>{postsStyles}</style>
    </>
  );
};
