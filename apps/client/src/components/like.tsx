'use client';

import { print } from 'graphql';
import gql from 'graphql-tag';
import { PageFragmentFragment } from 'letterpad-sdk';
import { FC, useCallback, useEffect, useState } from 'react';
import { BiHeart, BiSolidHeart } from 'react-icons/bi';
import { Message } from 'ui';

import { getApiRootUrl } from '@/lib/utils/url';

import { useSession } from '../../context/SessionProvider';

const query = gql`
  query isPostLiked($postId: Int!) {
    isPostLiked(postId: $postId) {
      ok
      liked
      message
    }
  }
`;

interface Props {
  postId: number;
  likes: PageFragmentFragment['likes'];
}
export const Like: FC<Props> = ({ postId, likes }) => {
  const [liked, setLiked] = useState(false);
  const [likesArr, setLikesArr] = useState(likes ?? []);
  const session = useSession();

  const checkIfLiked = useCallback(async () => {
    const url = new URL('/redirect-api/graphql', window.location.href);
    const req = await fetch(url.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: print(query),
        variables: {
          postId,
        },
      }),
    });
    const data = await req.json();
    return data?.data?.isPostLiked?.liked;
  }, [postId]);

  useEffect(() => {
    if (!session?.user.name) {
      return;
    }
    checkIfLiked().then(setLiked);
  }, [checkIfLiked, session]);

  const sendRequest = async (path: string) => {
    if (!session?.user.name) {
      setLiked(false);
      return Message().error({
        content: 'You must be logged in to like this event',
      });
    }
    const url = new URL(path, window.location.href);
    const params = new URLSearchParams({
      id: postId.toString(),
      type: 'post',
    });
    url.search = params.toString();
    const req = await fetch(url.href);
    const data = await req.json();
    return data.data;
  };

  const onLike = async () => {
    setLiked(true);
    try {
      const res = await sendRequest('/redirect-api/events/like');
      if (!res.likePost.ok) {
        setLiked(false);
      } else {
        setLikesArr((likes) => [
          { avatar: session?.user.avatar, username: session?.user.name },
          ...likes,
        ]);
      }
    } catch (e) {
      setLiked(false);
    }
  };
  const onUnlike = async () => {
    // const res = await sendRequest('/redirect-api/events/unlike');
    // if (res.unLikePost.ok) setLiked(false);
  };

  return (
    <div className="flex flex-row items-center justify-center sticky top-0">
      {liked ? (
        <button
          className="group flex flex-row items-center overflow-hidden rounded-full bg-slate-100 pl-2 pr-1 text-sm font-semibold leading-snug text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 hover:dark:bg-slate-700  gap-2 py-1"
          onClick={onUnlike}
        >
          <BiSolidHeart size={20} className="text-red-500" />
          <span>{likesArr!.length}</span>
          <Avatars likes={likesArr} />
        </button>
      ) : (
        <button
          className="group flex flex-row items-center overflow-hidden rounded-full bg-slate-100 pl-2 pr-1 text-sm font-semibold leading-snug text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 hover:dark:bg-slate-700 gap-2 py-1"
          onClick={onLike}
        >
          <BiHeart size={20} />
          <span>{likesArr!.length}</span>
          <Avatars likes={likesArr} />
        </button>
      )}
    </div>
  );
};

const Avatars: FC<{ likes: PageFragmentFragment['likes'] }> = ({ likes }) => {
  const pickThreeLikes = likes!.slice(0, 3);
  const hasMore = likes!.length - 3;
  return (
    <div className="flex -space-x-4 rtl:space-x-reverse flex-row">
      {pickThreeLikes.map((like) => {
        return (
          <a
            className="relative h-8 w-8 rounded-full border-2 border-slate-100 bg-white group-hover:border-slate-200 dark:border-slate-800 dark:bg-slate-600 group-hover:dark:border-slate-700 [&:not(:first-of-type)]:-ml-3"
            href={`${getApiRootUrl()}/@${like?.username}`}
            target="_blank"
            rel="noreferrer"
          >
            <img
              className="block mr-3 h-full w-full rounded-full hover:opacity-80 object-cover"
              src={like?.avatar!}
              loading="lazy"
              alt={`@${like?.username}`}
            />
          </a>
        );
      })}
      {hasMore > 0 && (
        <div className="relative -ml-3 flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border-2 border-slate-100 bg-white px-1 group-hover:border-slate-200 dark:border-slate-800 dark:bg-slate-600 group-hover:dark:border-slate-700">
          <p className="truncate text-xs font-normal">+{hasMore}</p>
        </div>
      )}
    </div>
  );
};
