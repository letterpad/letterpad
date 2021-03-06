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
import Helmet from "react-helmet";
import React from "react";
import SEO from "./helpers/SEO";
import config from "../config/config.prod";
import { useQuery } from "react-apollo";

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
        const { previewHash, slug } = props.router.match.params;
        const filters: { previewHash?: string; slug?: string } = {};
        if (previewHash) {
          filters.previewHash = previewHash;
        } else {
          filters.slug = slug;
        }
        const result = useQuery<PostQuery, PostQueryVariables>(QUERY_POST, {
          variables: {
            filters: {
              ...filters,
            },
          },
          fetchPolicy: "network-only",
        });
        loading = result.loading;
        if (result.data && result.data.post) {
          data = result.data.post as Post;
          SEOComponent = (
            <SEO
              schema="BlogPosting"
              title={data.title}
              description={data.excerpt}
              path={props.router.location.pathname}
              contentType="article"
              tags={data.tags.map(tag => tag.name).join(",")}
              image={data.cover_image.src}
              settings={props.settings || {}}
            />
          );
        }
        break;
      }
      case EnumContentType.POSTS: {
        const { params, path } = props.router.match;
        const filters: { [key: string]: any } = {
          limit: 10,
          page: parseInt(params.page_no || "0"),
        };

        if (path === config.BASE_NAME + "/") {
          filters.tagSlug = "/";
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
          if (data.rows.length > 0) {
            SEOComponent = (
              <Helmet>
                {data.rows.map(item => (
                  <link
                    href={config.BASE_NAME + item.slug}
                    rel="prefetch"
                    as="document"
                  />
                ))}
                {data.rows.map(item => (
                  <link
                    href={config.BASE_NAME + "/" + item.slug}
                    rel="prerender"
                  />
                ))}
              </Helmet>
            );
          }
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
