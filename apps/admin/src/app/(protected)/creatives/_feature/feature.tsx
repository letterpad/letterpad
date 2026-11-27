"use client";
import {
  PostsFilters,
  PostStatusOptions,
  PostTypes,
  PostWithAuthorAndTagsFragment,
} from "letterpad-graphql";
import { usePostsQuery } from "letterpad-graphql/hooks";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { DataTable } from "ui/dist/index.mjs";

import ErrorMessage from "@/components/ErrorMessage";

import Filters from "@/app/(protected)/posts/_feature/filters";
import { columns } from "@/app/(protected)/posts/_feature/header";

import { useUpdatePost } from "../../post/[postId]/_feature/api.client";
import { AutoSaveForm } from "../../post/[postId]/_feature/AutoSaveForm";
import { PostSettingsModal } from "../../post/[postId]/_feature/components/post-settings/drawer";
import { DEFAULT_FILTERS } from "../../../../constants";
import { isPostsNode } from "../../../../utils/type-guards";

export const Feature = () => {
  const [postId, setPostId] = useState<string | null>(null);
  const [filters, setFilters] = useState<PostsFilters>({
    ...DEFAULT_FILTERS,
    type: PostTypes.Page,
  });
  const [{ data, fetching: loading, error }] = usePostsQuery({
    variables: { filters },
  });
  const source = isPostsNode(data?.posts) ? data.posts.rows : [];
  const selectedPost = source?.find((p) => p.id === postId);

  const methods = useForm<PostWithAuthorAndTagsFragment | {}>({
    values: selectedPost || {},
    mode: "all",
    reValidateMode: "onBlur",
  });
  const { updatePost } = useUpdatePost();

  if (error) {
    return <ErrorMessage description={error} title="Error" />;
  }
  const changeStatus = (id: string, status: PostStatusOptions) => {
    updatePost({ id, status });
  };

  return (
    <div className="admin-post-list">
      <DataTable
        rightToolBar={
          <Filters
            showTags={false}
            showSort={false}
            showPageTypes
            filters={filters}
            setFilters={setFilters}
          />
        }
        columns={columns({
          changeStatus,
          onSettingsClick: setPostId,
          displayTags: false,
        })}
        data={isPostsNode(data?.posts) ? data.posts.rows : []}
        loading={loading}
      />
      <FormProvider {...methods}>
        <AutoSaveForm defaultValue={selectedPost} />
        <PostSettingsModal visible={!!postId} onClose={() => setPostId(null)} />
      </FormProvider>
    </div>
  );
};
