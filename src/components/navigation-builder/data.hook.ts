import { useEffect, useState } from "react";

import {
  NavigationType,
  Post,
  PostTypes,
  Tag,
} from "@/__generated__/__types__";
import {
  PostsDocument,
  PostsQuery,
  PostsQueryVariables,
  TagsDocument,
  TagsQuery,
  TagsQueryVariables,
} from "@/__generated__/queries/queries.graphql";
import { apolloBrowserClient } from "@/graphql/apolloBrowserClient";

import { Collection } from "./types";

interface IReturn {
  loading: boolean;
  collection: Collection[];
}

function useNavigationData(): IReturn {
  const [tags, setTags] = useState<Tag[]>([]);
  const [pages, setPages] = useState<Post[] | []>([]);
  const [loading, setLoading] = useState<boolean>(true);

  async function fetchData() {
    const tagsData = await apolloBrowserClient.query<
      TagsQuery,
      TagsQueryVariables
    >({
      query: TagsDocument,
    });

    const pagesData = await apolloBrowserClient.query<
      PostsQuery,
      PostsQueryVariables
    >({
      query: PostsDocument,
      variables: {
        filters: {
          type: PostTypes.Page,
        },
      },
    });

    return { tagsData, pagesData };
  }

  useEffect(() => {
    async function init() {
      const { tagsData, pagesData } = await fetchData();
      if (tagsData.data.tags?.__typename === "TagsNode") {
        if (tagsData.data.tags.rows.length > 0) {
          setTags(normalizeTags(tagsData.data.tags.rows));
        }
      }

      if (pagesData.data.posts.__typename === "PostsNode") {
        const { rows } = pagesData.data.posts;
        if (pagesData.data && rows && rows.length > 0) {
          setPages(normalizePages(pagesData.data.posts));
        }
      }

      if (!tagsData.loading && !pagesData.loading) {
        setLoading(false);
      }
    }
    init();
  }, []);

  const rss = {
    type: NavigationType.Custom,
    slug: "rss.xml",
    label: "Rss Feed of your site",
    original_name: "Rss",
  };
  return { loading, collection: addIds([...pages, ...tags, { ...rss }]) };
}

export { useNavigationData };

function normalizePages(pages) {
  return pages.rows
    .map((item) => {
      return {
        type: NavigationType.Page,
        slug: filterSlug(item.slug),
        label: item.title,
        original_name: item.title,
        postCount: pages.count,
      };
    })
    .filter((item) => item.original_name.length > 0);
}

function normalizeTags(tags) {
  return tags.map((item) => {
    return {
      type: NavigationType.Tag,
      slug: filterSlug(item.slug),
      label: item.name,
      original_name: item.name,
      postCount: item.posts.count,
    };
  });
}

function addIds(arr) {
  return arr.map((item, idx) => {
    item.id = idx;
    return item;
  });
}

function filterSlug(path) {
  // return path;
  return path.split("/").pop();
}
