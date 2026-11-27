"use server";
import { print } from "graphql";
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
  LetterpadTrendingPostsDocument,
  LetterpadTrendingPostsQuery,
  PopularTagsDocument,
  PopularTagsQuery,
} from "letterpad-graphql";
import { cookies } from "next/headers";

import { searchHomepageStories } from "@/components/homepage/data";

import { getApiUrl } from "@/shared/getRootUrl";

import { client } from "../../lib/urqlClient";

const apiUrl = typeof window === "undefined" ? getApiUrl() : "";

export async function getLetterpadPosts(
  filters: LetterpadLatestPostsQueryVariables
) {
  const resp = await fetch(apiUrl, {
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
  const resp = await fetch(apiUrl, {
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
  return searchHomepageStories(search);
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
  const res = await client.query<
    LetterpadFeaturedPostsQuery,
    LetterpadFeaturedPostsQueryVariables
  >(
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
  return res.data?.letterpadFeaturedPosts.__typename === "PostsNode"
    ? res.data.letterpadFeaturedPosts.rows
    : [];
}

export async function getTrendingPosts() {
  "use server";
  const res = await client.query<
    LetterpadTrendingPostsQuery,
    LetterpadFeaturedPostsQueryVariables
  >(
    LetterpadTrendingPostsDocument,
    {},
    {
      fetch,
      fetchOptions: {
        next: {
          tags: ["trendingPosts"],
        },
        cache: "force-cache",
      },
    }
  );
  return res.data?.letterpadTrendingPosts.__typename === "PostsNode"
    ? res.data.letterpadTrendingPosts.rows
    : [];
}

export async function setAbTestVersion(isControl: boolean) {
  "use server";
  cookies().set("trendingPosition", isControl ? "control" : "variation");
}
