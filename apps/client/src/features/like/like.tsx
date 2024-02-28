'use client';

import { FC } from 'react';

import { LikeComponent } from './component';
import { useLikeContext } from './context';

export const Like: FC = () => {
  const { liked, likesArr, onLike } = useLikeContext();
  const onUnlike = async () => {
    // const res = await sendRequest('/redirect-api/events/unlike');
    // if (res.unLikePost.ok) setLiked(false);
  };

  return (
    <div className="flex flex-row items-center justify-center sticky top-0">
      {liked ? (
        <button
          className="group flex flex-row items-center overflow-hidden rounded-full  pl-2 pr-1 text-sm font-semibold leading-snug    gap-2 py-1"
          onClick={onUnlike}
        >
          <LikeComponent liked={true} likesArr={likesArr} />
        </button>
      ) : (
        <button
          className="group flex flex-row items-center overflow-hidden rounded-full  pl-2 pr-1 text-sm font-semibold leading-snug   gap-2 py-1"
          onClick={onLike}
        >
          <LikeComponent liked={false} likesArr={likesArr} />
        </button>
      )}
    </div>
  );
};
