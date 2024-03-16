import {
  NavigationType,
  Post,
  PostTypes,
  Tag,
} from "letterpad-graphql";
import { useEffect, useState } from "react";

import { Collection } from "./types";
import { useGetPosts } from "../../app/posts/_feature/api.client";
import { useGetTags } from "../../app/tags/_feature/api.client";

interface IReturn {
  loading: boolean;
  collection: Collection[];
}

function useNavigationData(): IReturn {
  const [tags, setTags] = useState<Tag[]>([]);
  const [pages, setPages] = useState<Post[] | []>([]);

  const { data: tagsData, fetching: tagsLoading } = useGetTags();
  const { data: pagesData, fetching: pagesLoading } = useGetPosts({
    type: PostTypes.Page,
  });
  const [loading] = useState<boolean>(tagsLoading || pagesLoading);

  useEffect(() => {
    if (tagsData) {
      if (tagsData.length > 0) {
        setTags(normalizeTags(tagsData));
      }
    }

    if (pagesData) {
      if (pagesData.length > 0) {
        setPages(normalizePages(pagesData));
      }
    }
  }, [pagesData, tagsData]);

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
  return pages
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
