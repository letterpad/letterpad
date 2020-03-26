import {
  Post,
  PostStatusOptions,
  PostTypes,
  PostsQuery,
  TaxonomiesQuery,
  TaxonomiesQueryVariables,
  Taxonomy,
  TaxonomyType,
} from "../../../__generated__/gqlTypes";
import { QUERY_POSTS, QUERY_TAXONOMIES } from "../../../shared/queries/Queries";
import { useEffect, useState } from "react";

import { useQuery } from "react-apollo";

function useNavigationData() {
  const [categories, setCategories] = useState<Taxonomy[]>([]);
  const [pages, setPages] = useState<Post[] | []>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const categoriesData = useQuery<TaxonomiesQuery, TaxonomiesQueryVariables>(
    QUERY_TAXONOMIES,
    {
      variables: {
        filters: {
          type: TaxonomyType.PostCategory,
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
    if (categoriesData.data && categoriesData.data.taxonomies.length > 0) {
      setCategories(normalizeCategories(categoriesData.data.taxonomies));
    }
    if (pagesData.data && pagesData.data.posts.rows.length > 0) {
      setPages(normalizePages(pagesData.data.posts.rows));
    }
    if (!categoriesData.loading && !pagesData.loading) {
      setLoading(false);
    }
  }, [categoriesData.loading, pagesData.loading]);

  return { loading, data: addIds([...pages, ...categories]) };
}

export { useNavigationData };

function normalizePages(pages) {
  return pages.map(item => {
    return {
      type: item.type,
      slug: item.slug.replace("/page/", ""),
      name: item.title,
      originalName: item.title,
    };
  });
}

function normalizeCategories(categories) {
  return categories.map(item => {
    return {
      type: "category",
      slug: item.slug.replace("/category/", ""),
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
