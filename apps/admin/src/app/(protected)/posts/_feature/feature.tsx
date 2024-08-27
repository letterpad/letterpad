"use client";

import {
  AdminPostsDocument,
  AdminPostsFragmentFragment,
  AdminPostsQuery,
  AdminPostsQueryVariables,
  PostsFilters,
  PostStatusOptions,
  PostWithAuthorAndTagsFragment,
} from "letterpad-graphql";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { DataTable, Paginator, useResponsiveLayout } from "ui/dist/index.mjs";

import { postsStyles } from "@/components/posts.css";

import { client } from "@/lib/urqlClient";
import { useNavigateWithParams } from "@/hooks/useSearchParams";

import { useRedirectToOnboard } from "@/components/onboard/useRedirectToOnboard";

import {
  AutoSaveForm,
  PostSettingsModal,
  useUpdatePost,
} from "@/app/(protected)/post/[postId]/_feature";
import { DEFAULT_FILTERS } from "@/constants";
import { isPostsNode } from "@/utils/type-guards";
import { convertParamsToFilters } from "@/utils/utils";

import Filters from "./filters";
import { columns } from "./header";

export const Feature = () => {
  const router = useRouter();
  const { sidebarVisible } = useResponsiveLayout();
  const { updateParamsAndNavigate, params } = useNavigateWithParams();

  const [postId, setPostId] = useState<string | null>(null);
  const [posts, setPosts] = useState<AdminPostsFragmentFragment[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const filters = useMemo(() => convertParamsToFilters(params), [params]);

  const fetchData = useCallback(async (filters: PostsFilters) => {
    setLoading(true);
    const response = await client.query<
      AdminPostsQuery,
      AdminPostsQueryVariables
    >(AdminPostsDocument, { filters: { ...DEFAULT_FILTERS, ...filters } });
    if (isPostsNode(response?.data?.posts)) {
      setPosts(response.data.posts.rows);
      setTotalPages(
        Math.ceil(response.data.posts.count / DEFAULT_FILTERS.limit)
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData(filters);
  }, [fetchData, filters]);

  const selectedPost = useMemo(
    () => posts.find((p) => p.id === postId),
    [posts, postId]
  );

  const methods = useForm<PostWithAuthorAndTagsFragment | {}>({
    values: selectedPost || {},
    mode: "all",
    reValidateMode: "onBlur",
  });

  const { updatePost } = useUpdatePost();
  useRedirectToOnboard();

  const changeStatus = useCallback(
    async (id: string, status: PostStatusOptions) => {
      await updatePost({ id, status });
      fetchData(filters);
    },
    [fetchData, filters, updatePost]
  );

  useEffect(() => {
    if (postId && selectedPost) {
      methods.reset(selectedPost);
    }
  }, [methods, selectedPost, postId]);

  return (
    <>
      <DataTable
        rightToolBar={
          <Filters
            filters={filters}
            setFilters={(change) => {
              setPosts([]);
              updateParamsAndNavigate({ ...change, page: 1 });
            }}
            showTags={false}
          />
        }
        columns={columns({
          changeStatus,
          onSettingsClick: setPostId,
          onClick: (id: string) => router.push("/post/" + id),
          displayTags: true,
        })}
        data={posts}
        loading={loading}
      />
      <div className="flex justify-end my-8">
        <Paginator
          currentPage={parseInt(params.get("page") || "1", 10)}
          totalPages={totalPages}
          onPageChange={(page) => {
            setPosts([]);
            updateParamsAndNavigate({ page });
          }}
          showPreviousNext={false}
        />
      </div>
      <style jsx>{postsStyles}</style>
      <FormProvider {...methods}>
        <AutoSaveForm defaultValue={selectedPost} />
        <PostSettingsModal
          visible={!!postId}
          onClose={() => setPostId(null)}
          className={sidebarVisible ? "!w-[calc(100vw-250px)]" : ""}
        />
      </FormProvider>
    </>
  );
};
