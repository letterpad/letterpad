import { FC } from 'react';
import { GridCard } from 'ui/isomorphic';

import { getRelatedPosts } from '../../data';
import { getReadableDate } from '../../utils';

interface Props {
  postId: string;
}

export const RelatedPosts: FC<Props> = async ({ postId }) => {
  const posts = await getRelatedPosts({ post_id: postId });
  if (!posts) return null;
  return (
    <div id="relatedPosts" className="pb-20">
      <div className="text-2xl font-bold pt-8">Related Posts</div>
      <div className="grid grid-cols-1 gap-8 py-12 md:grid-cols-2 3xl:grid-cols-3">
        {posts.rows.map((post) => {
          return (
            <GridCard
              key={post.slug}
              slug={post.slug!}
              publishedAt={getReadableDate(post.publishedAt!)}
              title={post.title}
              excerpt={post.excerpt! ?? post.sub_title}
              cover_image={post.cover_image}
              stats={post.stats!}
            />
          );
        })}
      </div>
      <section className="py-4 lg:py-8 antialiased"></section>
    </div>
  );
};

export default RelatedPosts;
