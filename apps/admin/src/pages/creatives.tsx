import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

import { postsStyles } from "@/components/posts.css";

import { useUpdatePost } from "@/hooks/useUpdatePost";

import ErrorMessage from "@/components/ErrorMessage";
import Filters from "@/components/filters";
import { creativesColumns } from "@/components/posts";
import { Header } from "@/components/posts/header";
import { Buttonv2 } from "@/components_v2/button";
import { Content } from "@/components_v2/content";
import { Table } from "@/components_v2/table";

import {
  PostsFilters,
  PostStatusOptions,
  PostTypes,
  SortBy,
} from "@/__generated__/__types__";
import { usePostsQuery } from "@/__generated__/queries/queries.graphql";

function Pages() {
  const { loading, data, error, refetch } = usePostsQuery({
    variables: { filters: { type: PostTypes.Page, sortBy: SortBy.Desc } },
  });
  const [filters, setFilters] = useState<PostsFilters>({
    sortBy: SortBy["Desc"],
    type: PostTypes.Page,
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
      <Head>
        <title>Creatives</title>
      </Head>
      <Header type={PostTypes.Page} title="Creatives">
        <div className="flex flex-row items-center justify-start">
          <span className="help-text">
            Creatives add more customisation to your site. Create portfolios,
            photo stories, write a picture book etc.
          </span>
          <Buttonv2 size="small" variant="ghost">
            <a
              href="https://letterpad.app/admin/try-creatives"
              target="_blank"
              rel="noreferrer"
            >
              Demo
            </a>
          </Buttonv2>
        </div>
      </Header>
      <Content>
        <Filters
          showTags={false}
          showPageTypes={true}
          onChange={(filters) => {
            refetch({ filters: { ...filters, type: PostTypes.Page } });
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
      </Content>
    </>
  );
}

export default Pages;
