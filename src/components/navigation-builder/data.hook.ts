import {
  PostsDocument,
  PostsQuery,
  PostsQueryVariables,
  TagsDocument,
  TagsQuery,
  TagsQueryVariables,
  NavigationType,
} from "@/__generated__/queries/queries.graphql";
import { useEffect, useState } from "react";

import { initializeApollo } from "@/graphql/apollo";
import { Post, PostTypes, Tags } from "@/__generated__/type-defs.graphqls";

function useNavigationData() {
  const [tags, setTags] = useState<Tags[]>([]);
  const [pages, setPages] = useState<Post[] | []>([]);
  const [loading, setLoading] = useState<boolean>(true);

  async function fetchData() {
    const client = await initializeApollo();
    const tagsData = await client.query<TagsQuery, TagsQueryVariables>({
      query: TagsDocument,
    });

    const pagesData = await client.query<PostsQuery, PostsQueryVariables>({
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
      if (tagsData.data && tagsData.data.tags.length > 0) {
        setTags(normalizeTags(tagsData.data.tags));
      }
      const rows = pagesData?.data?.posts?.rows;
      if (pagesData.data && rows && rows.length > 0) {
        setPages(normalizePages(pagesData.data.posts));
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
  return { loading, data: addIds([...pages, ...tags, { ...rss }]) };
}

export { useNavigationData };

function normalizePages(pages) {
  return pages.rows.map(item => {
    return {
      type: NavigationType.Page,
      slug: filterSlug(item.slug),
      label: item.title,
      original_name: item.title,
      postCount: pages.count,
    };
  });
}

function normalizeTags(tags) {
  return tags.map(item => {
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
  return path;
  return path.split("/").pop();
}
