import {
  Post,
  PostQuery,
  PostQueryVariables,
  PostSortBy,
  PostsNode,
  PostsQuery,
  PostsQueryVariables,
} from "../__generated__/gqlTypes";
import { QUERY_POST, QUERY_POSTS } from "../shared/queries/Queries";

import { EnumContentType } from "./types";
import React from "react";
import SEO from "./helpers/SEO";
import { useQuery } from "react-apollo";
import utils from "../shared/util";

function DataConnector(
  WrappedComponent: React.ComponentType<any>,
  contentType: EnumContentType,
) {
  const DataConnector = props => {
    let loading = true;
    let data: Post | PostsNode | undefined;
    let error = "";
    let SEOComponent: React.ReactChild | undefined;

    switch (contentType) {
      case EnumContentType.PAGE:
      case EnumContentType.POST: {
        const result = useQuery<PostQuery, PostQueryVariables>(QUERY_POST, {
          variables: {
            filters: {
              slug: props.router.match.params.slug,
            },
          },
        });
        loading = result.loading;
        if (result.data && result.data.post) {
          data = result.data.post as Post;
          const { tags, categories } = utils.getTagsAndCategories(
            data.taxonomies,
          );
          SEOComponent = (
            <SEO
              schema="BlogPosting"
              title={data.title}
              description={data.excerpt}
              path={props.router.location.pathname}
              contentType="article"
              category={categories.join(",")}
              tags={tags}
              image={data.cover_image.src}
              settings={props.settings || {}}
            />
          );
        }
        break;
      }
      case EnumContentType.POSTS: {
        const { params } = props.router.match;
        const filters: { [key: string]: any } = {
          limit: 10,
          page: parseInt(params.page_no || "0"),
        };

        if (params.category) {
          filters.categorySlug = params.category;
        }
        if (params.tag) {
          filters.tagSlug = params.tag;
        }
        filters.sortBy = PostSortBy.Newest;

        const result = useQuery<PostsQuery, PostsQueryVariables>(QUERY_POSTS, {
          variables: {
            filters,
          },
        });
        loading = result.loading;
        if (result.data && result.data) {
          data = result.data.posts as PostsNode;
        }
        break;
      }
    }

    return (
      <React.Fragment>
        {SEOComponent}
        <WrappedComponent
          loading={loading}
          data={data}
          error={error}
          {...props}
        />
      </React.Fragment>
    );
  };
  DataConnector.displayName = WrappedComponent.name;
  return DataConnector;
}

export default DataConnector;
