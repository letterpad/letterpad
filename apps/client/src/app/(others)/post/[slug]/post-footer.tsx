'use client';
import { PageFragmentFragment } from 'letterpad-sdk';
import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { GoComment } from 'react-icons/go';
import { Button, useIntersectionObserver } from 'ui/dist/index.mjs';

import { LikeComponent } from '@/features/like/component';
import { useLikeContext } from '@/features/like/context';

interface Props {
  author: {
    name: string;
    avatar: string;
  };
  likes: PageFragmentFragment['likes'] | null;
  postId: string;
  share: ReactNode;
}

export const PostFooter: FC<Props> = ({ author, likes = [], share }) => {
  const ref = useRef<HTMLElement | null>(null);
  const footerRef = useRef<HTMLElement | null>(null);
  const { isIntersecting } = useIntersectionObserver(ref, {});
  const { isIntersecting: footerIntersecting } = useIntersectionObserver(
    footerRef,
    {}
  );
  const [hide, setHide] = useState(true);
  const { liked, onLike } = useLikeContext();

  useEffect(() => {
    const node = document.getElementById('like-bar');
    const siteFooter = document.getElementById('site-footer');
    ref.current = node;
    footerRef.current = siteFooter;
  }, []);

  useEffect(() => {
    setHide(isIntersecting);
    if (footerIntersecting) {
      setHide(true);
    }
  }, [footerIntersecting, isIntersecting]);

  return (
    <div
      className={`bottom-0 left-0 w-full border-t-[1px] dark:border-neutral-900/50 bg-gray-100 dark:bg-black  ${hide ? 'translate-y-20' : 'translate-y-0'} fixed transition-transform duration-500 ease-in-out z-10`}
    >
      <div className="flex flex-col md:flex-row justify-between p-2 md:p-4 md:px-40">
        <div className="font-heading hidden md:flex items-center">
          Written by <span className="font-bold ml-1">{author.name}</span>
        </div>
        <div className="flex items-center gap-2 md:gap-6 justify-center">
          <Button
            className="flex items-center gap-1 font-paragraph text-sm"
            variant="ghost"
            size="small"
            onClick={() => {
              const node = document.getElementById('comment');
              node?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <GoComment />
            <span>Comment</span>
          </Button>
          <Button
            className="flex items-center gap-1 font-paragraph text-sm"
            variant="ghost"
            size="small"
            onClick={onLike}
          >
            <LikeComponent
              liked={liked}
              likesArr={likes ?? []}
              showAvatar={false}
            />
          </Button>
          {share}
        </div>
      </div>
    </div>
  );
};
