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
    },
  );
  const pagesData = useQuery<PostsQuery>(QUERY_POSTS, {
    variables: {
      filters: { type: PostTypes.Page, status: PostStatusOptions.Publish },
    },
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

  return { loading, data: [...pages, ...categories] };
}

export { useNavigationData };

function normalizePages(pages) {
  return pages.map(item => {
    return {
      id: item.id,
      type: item.type,
      slug: item.slug,
      name: item.title,
    };
  });
}

function normalizeCategories(categories) {
  return categories.map(item => {
    return {
      id: item.id,
      type: "category",
      slug: item.slug,
      name: item.name,
    };
  });
}
