'use client';
import { AiOutlineLoading3Quarters } from '@react-icons/all-files/ai/AiOutlineLoading3Quarters';
import { PostsFragmentFragment } from 'letterpad-sdk';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useIntersectionObserver } from 'ui/dist/index.mjs';

import { getPosts } from '../data';

interface Props {
  RenderCard: FC<{
    post: PostsFragmentFragment['rows'][0];
  }>;
}

export const InfiniteList: FC<Props> = ({ RenderCard }) => {
  const [data, setData] = useState<PostsFragmentFragment['rows']>([]);
  const [loading, setLoading] = useState(false);
  const observer = useRef(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(2);
  const { isIntersecting } = useIntersectionObserver(observer, {});

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const res = await getPosts(page);
    setLoading(false);
    if (res) {
      if (res.rows.length === 0) {
        setHasMore(false);
      } else {
        setData((prevData) => [...prevData, ...res.rows]);
        setPage((prevPage) => prevPage + 1);
      }
    }
  }, [hasMore, loading, page]);

  useEffect(() => {
    if (isIntersecting && hasMore && !loading) {
      loadMore();
    }
  }, [hasMore, isIntersecting, loadMore, loading]);

  return (
    <>
      {data.map((post) => (
        <RenderCard key={post.slug} post={post} />
      ))}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <AiOutlineLoading3Quarters className="animate-spin" size={24} />
        </div>
      )}
      <div ref={observer} />
    </>
  );
};
