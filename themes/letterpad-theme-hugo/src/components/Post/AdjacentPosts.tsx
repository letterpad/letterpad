import React from "react";
import { Link } from "react-router-dom";

import StyledAdjacentPosts from "./AdjacentPosts.css";
import { useQuery } from "react-apollo";
import { QUERY_ADJACENT_POSTS } from "letterpad-src/shared/queries/Queries";
import {
  AdjacentPostsQuery,
  AdjacentPosts,
  AdjacentPostsQueryVariables,
} from "letterpad-src/__generated__/gqlTypes";
import Loader from "../Loader";

const AdjacentPosts: React.FC<{ slug: string }> = ({ slug }) => {
  const { loading, data } = useQuery<
    AdjacentPostsQuery,
    AdjacentPostsQueryVariables
  >(QUERY_ADJACENT_POSTS, {
    variables: {
      slug,
    },
  });
  if (loading) return <Loader />;
  if (!data || !data.adjacentPosts) return null;

  const { adjacentPosts } = data;

  const { previous, next } = adjacentPosts;

  let prevPost = previous && (
    <Post
      direction="previous"
      slug={previous.slug}
      img={previous.cover_image}
      label="Previous"
    />
  );
  let nextPost = next && (
    <Post
      direction="next"
      slug={next.slug}
      img={next.cover_image}
      label="Next"
    />
  );

  return (
    <StyledAdjacentPosts className="adjacent-posts">
      {prevPost}
      {nextPost}
    </StyledAdjacentPosts>
  );
};

const Post: React.FC<{
  slug: string;
  img?: string;
  label: string;
  direction: string;
}> = ({ slug, label, direction }) => {
  return (
    <Link to={"/post/" + slug} className={"adjacent-post-item " + direction}>
      <label>
        {direction == "next" && label + " →"}
        {direction == "previous" && "← " + label}
      </label>
    </Link>
  );
};

export default AdjacentPosts;
