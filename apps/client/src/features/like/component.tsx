import { PageFragmentFragment } from 'letterpad-sdk';
import { FC } from 'react';

import { getProfileUrl } from '@/lib/utils/url';

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
      <div className="flex items-center gap-2">
        <span className={liked ? 'animate heart' : 'heart'}></span>
        <span>{likesArr!.length}</span>
      </div>
      {showAvatar && <Avatars likes={likesArr} />}
      <style jsx>{`
        .heart {
          background-image: url('/static/images/web_heart_animation.png');
          background-repeat: no-repeat;
          background-size: 2900%;
          background-position: left;
          height: 32px;
          width: 32px;
          margin: 0 auto;
          cursor: pointer;
          transform: scale(2);
          margin-right: -0.4rem;
        }

        .animate {
          animation: heart-burst 0.8s steps(28) forwards;
        }

        @keyframes heart-burst {
          0% {
            background-position: left;
          }
          100% {
            background-position: right;
          }
        }
      `}</style>
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
            href={getProfileUrl(like?.username!)}
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
