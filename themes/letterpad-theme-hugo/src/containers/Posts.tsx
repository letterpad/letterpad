import React from "react";
import ArticleListItem from "../components/Post/ArticleListItem";
import Loader from "../components/Loader";
import config from "letterpad-src/config";
import Paginate from "../components/Paginate";
import OhSnap from "../components/OhSnap";
import Pagination from "../styled/Pagination";
import HeroImage from "../components/HeroImage";
import { IThemeContainer } from "letterpad-src/client/types";
import { QUERY_POSTS } from "letterpad-src/shared/queries/Queries";
import {
  Post,
  PostsQuery,
  PostsQueryVariables,
} from "letterpad-src/__generated__/gqlTypes";
import { useQuery } from "react-apollo";

const Posts: IThemeContainer = ({
  router,
  settings,
  initialProps,
  ...rest
}) => {
  const { params } = router.match;

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
  const { loading, data } = useQuery<PostsQuery, PostsQueryVariables>(
    QUERY_POSTS,
    {
      variables: {
        filters,
      },
    },
  );

  if (loading) return <Loader />;
  const posts = data && data.posts;
  if (!posts) {
    return <OhSnap message={settings.text_notfound.value} />;
  }

  if (posts.rows.length === 0) {
    return <OhSnap message={settings.text_posts_empty.value} />;
  }

  const { banner } = settings;

  return (
    <section className="post-list">
      <HeroImage
        image={config.baseName + banner.value}
        display={banner.value.length > 0}
      />

      {(posts.rows as Post[]).map((post, i) => (
        <ArticleListItem key={i} post={post} isStatic={false} />
      ))}

      <Pagination className="pagination-wrapper">
        <Paginate limit={10} count={posts.count} match={router.match} />
      </Pagination>
    </section>
  );
};

export default Posts;
