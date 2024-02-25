"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Table } from "ui";

import { postsStyles } from "@/components/posts.css";

import { useIsPaidMember } from "@/hooks/useIsPaidMember";

import { useRedirectToOnboard } from "@/components/onboard/useRedirectToOnboard";
import { UpgradeLabel } from "@/components/upgrade-plan-banner";

import { PostsFilters, PostStatusOptions } from "@/__generated__/__types__";
import { useHomeQueryQuery } from "@/__generated__/src/graphql/queries/queries.graphql";
import {
  isIntroDismissed,
  setIntroDimissed,
} from "@/app/home/_feature/components/visibility";
import { postsColumns } from "@/app/posts/_feature/header";
import { isMembershipFeatureActive } from "@/shared/utils";

import { useGetPosts, useGetStats } from "./api.client";
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
  const isPaidMember = useIsPaidMember();
  const membershipActive = isMembershipFeatureActive();
  const { data: stats } = useGetStats();

  const changeStatus = (id: number, status: PostStatusOptions) => {
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
      {!isPaidMember && membershipActive && (
        <div className="p-2 dark:border-slate-800 border-slate-200 border-[1px] rounded mb-4 border-l-4 dark:border-l-yellow-500">
          You have {10 - (stats?.posts.published ?? 0)} posts left in the free
          version. To enjoy unlimited posts and many other features,{" "}
          <UpgradeLabel />.
        </div>
      )}
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
