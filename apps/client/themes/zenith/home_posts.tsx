import { FC } from 'react';

import { RenderCard } from './renderCard';
import { SectionContainer } from '../../src/components/section';
import { HomePostsProps } from '../../types/pageTypes';

export const HomePosts: FC<HomePostsProps> = ({ posts, loadMore }) => {
  return (
    <div className="relative">
      <SectionContainer className="px-4">
        <main className="">
          <div className="relative">
            <div className="pb-12 pt-16 sm:pb-4 lg:pt-12">
              <div className="lg:px-8">
                <div className="lg:max-w-4xl">
                  <h1 className="text-2xl font-bold leading-7 ">
                    Latest Posts
                  </h1>
                </div>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 sm:mt-4 lg:mt-8 lg:border-t lg:border-slate-100 dark:lg:border-slate-800">
                {posts.rows.map((post) => (
                  <RenderCard key={post.id} post={post} />
                ))}
                {loadMore(RenderCard)}
              </div>
            </div>
          </div>
        </main>
      </SectionContainer>
    </div>
  );
};
