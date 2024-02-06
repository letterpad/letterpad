"use server";
import { print } from "graphql";

import { client } from "../../lib/urqlClient";
import {
  LetterpadLatestPostsDocument,
  LetterpadLatestPostsQuery,
  PopularTagsDocument,
  PopularTagsQuery,
  PostsDocument,
  PostsQuery,
  PostsQueryVariables,
} from "../../../__generated__server/src/graphql/queries/queries.graphql";

export async function getLetterpadPosts(cursor: number) {
  const root = typeof window === "undefined" ? process.env.ROOT_URL : "";
  const resp = await fetch((root + "/api/graphql") as string, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: print(LetterpadLatestPostsDocument),
      variables: {
        cursor,
      },
    }),
    // next: {
    //   tags: ["letterpadLatestPosts"],
    // },
    cache: "no-cache",
  });
  const data = await resp.json();
  return data.data as LetterpadLatestPostsQuery;
}

export async function getLetterpadCategories() {
  const root = typeof window === "undefined" ? process.env.ROOT_URL : "";
  const resp = await fetch((root + "/api/graphql") as string, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: print(PopularTagsDocument),
    }),
    next: {
      tags: ["categories"],
    },
    cache: "no-cache",
  });
  const data = await resp.json();
  return data.data as PopularTagsQuery;
}

export async function doOmniSearch(search: string) {
  "use server";
  const res = await client.query<PostsQuery, PostsQueryVariables>(
    PostsDocument,
    {
      filters: {
        search,
      },
    },
    { requestPolicy: "network-only" }
  );
  return res.data?.posts.__typename === "PostsNode" ? res.data.posts.rows : [];
}
