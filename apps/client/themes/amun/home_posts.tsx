import { NavigationType, PostsFragmentFragment } from 'letterpad-sdk';
import { FC, ReactNode } from 'react';

import { Card, HorizontalCard } from './commons/card';
import { getPostsByTag, getTagsData } from '../../src/data';
import { HomePostsProps } from '../../types/pageTypes';
import { SectionContainer } from '../../src/components/section';

const pickThreePostsMax = (posts: PostsFragmentFragment['rows']) => {
  if (posts.length >= 3) return posts.slice(0, 3);
  if (posts.length >= 2) return posts.slice(0, 2);
  if (posts.length >= 1) return posts.slice(0, 1);
  return posts;
};

export const HomePosts: FC<HomePostsProps> = ({ posts }) => {
  const firstThreeMax = pickThreePostsMax(posts.rows);
  const olderPosts = posts.rows.slice(firstThreeMax.length);
  return (
    <SectionContainer className="mx-auto max-w-7xl md:px-20">
      <div className="mb-10 flex flex-col gap-12 lg:flex-row">
        <LatestPosts posts={firstThreeMax} />
        <SidePosts />
      </div>

      <OlderPosts posts={olderPosts} />
    </SectionContainer>
  );
};

const LatestPosts = ({ posts }: { posts: PostsFragmentFragment['rows'] }) => {
  let latestThreePosts: ReactNode = null;
  let count = posts.length;
  if (count === 1) {
    latestThreePosts = (
      <>
        <Card post={posts[0]} size="md" />
      </>
    );
  }
  if (count === 2) {
    latestThreePosts = (
      <>
        <Card post={posts[0]} size="md" />
        <div className="flex flex-col gap-10 md:flex-row xl:flex-col ">
          <div className="flex-1">
            <Card post={posts[1]} />
          </div>
        </div>
      </>
    );
  }
  if (count === 3) {
    latestThreePosts = (
      <>
        <Card post={posts[0]} size="md" />
        <div className="flex flex-col gap-6 lg:flex-row xl:flex-col">
          <div className="flex-1">
            <Card post={posts[1]} imageHeight="sm" size="sm" />
          </div>
          <div className="flex-1">
            <Card post={posts[2]} imageHeight="sm" size="sm" />
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col">
      <SectionHeading>Latest Posts</SectionHeading>
      <div className="flex flex-wrap gap-10 xl:flex-nowrap ">
        {latestThreePosts}
      </div>
    </div>
  );
};

const OlderPosts = ({ posts }: { posts: PostsFragmentFragment['rows'] }) => {
  if (posts.length === 0) return null;
  return (
    <div className="flex flex-col">
      <SectionHeading>Previous Posts</SectionHeading>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Card post={post} />
        ))}
      </div>
    </div>
  );
};

const SidePosts = async () => {
  const data = await getTagsData();
  if (!data) return null;
  const { tags, settings } = data;
  const defaultHomeTag =
    settings?.menu[0].type === NavigationType.Tag ? settings.menu[0] : null;
  const tagsWithoutHome = tags.rows.filter(
    (item) => item.slug !== defaultHomeTag?.slug
  );
  const tag = getRandom(tagsWithoutHome);

  const postsTag = await getPostsByTag(tag.slug);
  if (!postsTag?.posts) return null;

  if (postsTag.posts.rows.length === 0) return null;
  return (
    <div className="hidden flex-col dark:bg-opacity-30 lg:flex">
      <SectionHeading>
        #Random: Posts on {tag.name.toUpperCase()}
      </SectionHeading>
      <div className="space-y-8">
        {postsTag.posts.rows.slice(0, 3).map((tag) => (
          <HorizontalCard post={tag} key={tag.id} />
        ))}
      </div>
    </div>
  );
};

function getRandom<T>(list: T[]) {
  return list[Math.floor(Math.random() * list.length)];
}

const SectionHeading = ({ children }) => {
  return (
    <span className="font-system mb-4 mt-10 border-l-2 border-accent-50 pl-2 text-base font-bold uppercase tracking-wider text-accent-50">
      {children}
    </span>
  );
};
