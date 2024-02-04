import { print } from "graphql";

import {
  GetCategoriesDocument,
  GetCategoriesQuery,
  LetterpadLatestPostsDocument,
  LetterpadLatestPostsQuery,
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
      query: print(GetCategoriesDocument),
    }),
    next: {
      tags: ["categories"],
    },
    cache: "no-cache",
  });
  const data = await resp.json();
  return data.data as GetCategoriesQuery;
}
