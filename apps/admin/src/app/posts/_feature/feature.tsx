"use client";

import {
  PostsFilters,
  PostStatusOptions,
  PostWithAuthorAndTagsFragment,
} from "letterpad-graphql";
import { useHomeQueryQuery } from "letterpad-graphql/hooks";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Table, useResponsiveLayout } from "ui";

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
import { PostSettingsModal } from "../../post/[postId]/_feature/components/post-settings/drawer";

export const Feature = () => {
  const router = useRouter();
  const [postId, setPostId] = useState<string | null>(null);
  const [filters, setFilters] = useState<PostsFilters>(DEFAULT_FILTERS);
  const { data, refetch, fetching } = useGetPosts(filters);
  const selectedPost = data?.find((p) => p.id === postId);
  const { sidebarVisible } = useResponsiveLayout();
  const methods = useForm<PostWithAuthorAndTagsFragment | {}>({
    values: selectedPost || {},
    mode: "all",
    reValidateMode: "onBlur",
  });
  const [{ data: homeData }] = useHomeQueryQuery();
  const { updatePost } = useUpdatePost();
  useRedirectToOnboard();

  const changeStatus = async (id: string, status: PostStatusOptions) => {
    await updatePost({ id, status });
    refetch({ requestPolicy: "network-only" });
  };

  useEffect(() => {
    if (postId && selectedPost) {
      methods.reset(selectedPost);
    }
  }, [methods, selectedPost, postId]);

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
        columns={postsColumns({
          changeStatus,
          onSettingsClick: setPostId,
        })}
        dataSource={fetching ? [] : data}
        loading={fetching}
        onRowClick={(row) => router.push("/post/" + row.id)}
      />
      <style jsx>{postsStyles}</style>
      <FormProvider {...methods}>
        <PostSettingsModal
          visible={!!postId}
          onClose={() => setPostId(null)}
          className={sidebarVisible ? "!w-[calc(100vw-250px)]" : ""}
        />
      </FormProvider>
    </>
  );
};
