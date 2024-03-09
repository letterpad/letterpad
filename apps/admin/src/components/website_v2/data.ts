"use server";
import { print } from "graphql";

import { client } from "../../lib/urqlClient";
import {
  FavAuthorsDocument,
  FavAuthorsQuery,
  FavAuthorsQueryVariables,
  LetterpadFeaturedPostsDocument,
  LetterpadFeaturedPostsQuery,
  LetterpadFeaturedPostsQueryVariables,
  LetterpadLatestPostsDocument,
  LetterpadLatestPostsQuery,
  LetterpadLatestPostsQueryVariables,
  PopularTagsDocument,
  PopularTagsQuery,
  PostsDocument,
  PostsQuery,
  PostsQueryVariables,
} from "../../../__generated__server/src/graphql/queries/queries.graphql";

export async function getLetterpadPosts(
  filters: LetterpadLatestPostsQueryVariables
) {
  const root = typeof window === "undefined" ? process.env.ROOT_URL : "";
  const resp = await fetch((root + "/api/graphql") as string, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: print(LetterpadLatestPostsDocument),
      variables: {
        filters: filters.filters,
      },
    }),
    next: {
      tags: ["letterpadLatestPosts"],
    },
    cache: "force-cache",
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
    cache: "force-cache",
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

export async function getfavAuthors() {
  "use server";
  const res = await client.query<FavAuthorsQuery, FavAuthorsQueryVariables>(
    FavAuthorsDocument,
    {},
    {
      requestPolicy: "network-only",
      fetch,
      fetchOptions: {
        next: {
          tags: ["newAuthors"],
        },
        cache: "force-cache",
      },
    }
  );
  return res.data?.favAuthors?.authors || [];
}

export async function getFeaturedPosts() {
  "use server";
  const res = await client.query<LetterpadFeaturedPostsQuery, LetterpadFeaturedPostsQueryVariables>(
    LetterpadFeaturedPostsDocument,
    {},
    {
      requestPolicy: "network-only",
      fetch,
      fetchOptions: {
        next: {
          tags: ["featuredPosts"],
        },
        cache: "force-cache",
      },
    }
  );
  return res.data?.letterpadFeaturedPosts.__typename === "PostsNode" ? res.data.letterpadFeaturedPosts.rows : [];
}
