import { FC } from 'react';
import { HomePostsProps } from 'types/pageTypes';
import { Image } from 'ui/dist/isomorphic.mjs';

import Link from '@/components/Link';

export const HomePosts: FC<HomePostsProps> = ({ posts }) => {
  return (
    <div className="bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500">
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-4xl font-bold text-white">90s Sunset Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {posts.rows.map((post) => (
            <div key={post.id} className="rounded overflow-hidden shadow-lg bg-white">
              <Link href={`/post/${post.slug}`}>
                <Image src={post.cover_image.src!} alt={post.title} className="w-full" />
                <div className="px-6 py-4">
                  <div className="font-bold text-xl mb-2">{post.title}</div>
                  <p className="text-gray-700 text-base">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
