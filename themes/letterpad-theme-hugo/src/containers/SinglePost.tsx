import React from "react";
import { useQuery } from "react-apollo";

import Article from "../components/Post/Article";
import Loader from "../components/Loader";
import SEO from "../components/SEO";
import OhSnap from "../components/OhSnap";
import AdjacentPosts from "../components/Post/AdjacentPosts";
import utils from "letterpad-src/shared/util";
import { IThemeContainer } from "letterpad-src/client/types";
import { QUERY_POST } from "letterpad-src/shared/queries/Queries";
import {
  PostQuery,
  PostQueryVariables,
} from "letterpad-src/__generated__/gqlTypes";

const SinglePost: IThemeContainer = ({ router, settings }) => {
  const { loading, data } = useQuery<PostQuery, PostQueryVariables>(
    QUERY_POST,
    {
      variables: {
        filters: {
          slug: router.match.params.slug,
        },
      },
    },
  );
  if (loading) return <Loader />;
  if (!data || data.post === null) {
    return (
      <OhSnap message="Sorry, this post does not exist or might be restricted." />
    );
  }
  const { post } = data;
  const { tags, categories } = utils.getTagsAndCategories(post.taxonomies);

  return (
    <div>
      <SEO
        schema="BlogPosting"
        title={post.title}
        description={post.excerpt}
        path={router.location.pathname}
        contentType="article"
        category={categories.join(",")}
        tags={tags}
        image={post.cover_image}
        settings={settings || {}}
      />
      <Article
        post={post}
        settings={settings}
        adjacentPosts={<AdjacentPosts slug={post.slug} />}
      />
    </div>
  );
};
export default SinglePost;
