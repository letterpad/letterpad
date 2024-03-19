import { PageFragmentFragment } from 'letterpad-sdk';
import { FC } from 'react';
import { BiHeart, BiSolidHeart } from 'react-icons/bi';

import { getApiRootUrl } from '@/lib/utils/url';

interface Props {
  liked: boolean;
  likesArr: PageFragmentFragment['likes'];
  showAvatar?: boolean;
}

export const LikeComponent: FC<Props> = ({
  liked,
  likesArr,
  showAvatar = true,
}) => {
  return (
    <>
      {liked ? (
        <BiSolidHeart size={20} className="text-red-500" />
      ) : (
        <BiHeart size={20} />
      )}
      <span>{likesArr!.length}</span>
      {showAvatar && <Avatars likes={likesArr} />}
    </>
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
            key={like?.username}
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
