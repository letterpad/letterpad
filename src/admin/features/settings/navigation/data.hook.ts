import {
  Post,
  PostStatusOptions,
  PostTypes,
  PostsQuery,
  TaxonomiesQuery,
  TaxonomiesQueryVariables,
  Taxonomy,
  TaxonomyType,
} from "../../../../__generated__/gqlTypes";
import {
  QUERY_POSTS,
  QUERY_TAXONOMIES,
} from "../../../../shared/queries/Queries";
import { useEffect, useState } from "react";

import config from "../../../../config";
import { useQuery } from "react-apollo";

function useNavigationData() {
  const [tags, setTags] = useState<Taxonomy[]>([]);
  const [pages, setPages] = useState<Post[] | []>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const tagsData = useQuery<TaxonomiesQuery, TaxonomiesQueryVariables>(
    QUERY_TAXONOMIES,
    {
      variables: {
        filters: {
          type: TaxonomyType.PostTag,
        },
      },
      fetchPolicy: "network-only",
    },
  );
  const pagesData = useQuery<PostsQuery>(QUERY_POSTS, {
    variables: {
      filters: { type: PostTypes.Page, status: PostStatusOptions.Publish },
    },
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (tagsData.data && tagsData.data.taxonomies.length > 0) {
      setTags(normalizeTags(tagsData.data.taxonomies));
    }
    if (pagesData.data && pagesData.data.posts.rows.length > 0) {
      setPages(normalizePages(pagesData.data.posts.rows));
    }
    if (!tagsData.loading && !pagesData.loading) {
      setLoading(false);
    }
  }, [tagsData.loading, pagesData.loading]);

  const rss = {
    type: "rss",
    slug: config.rssPath,
    name: "Rss Feed of your site",
    originalName: "Rss",
  };
  return { loading, data: addIds([...pages, ...tags, { ...rss }]) };
}

export { useNavigationData };

function normalizePages(pages) {
  return pages.map(item => {
    return {
      type: item.type,
      slug: item.slug.replace("page/", ""),
      name: item.title,
      originalName: item.title,
    };
  });
}

function normalizeTags(tags) {
  return tags.map(item => {
    return {
      type: "tag",
      slug: item.slug.replace("tag/", ""),
      name: item.name,
      originalName: item.name,
    };
  });
}

function addIds(arr) {
  return arr.map((item, idx) => {
    item.id = idx;
    return item;
  });
}
