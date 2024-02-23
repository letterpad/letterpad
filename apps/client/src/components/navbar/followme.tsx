'use client';

import { useEffect, useState } from 'react';
import { IoMdPersonAdd } from 'react-icons/io';
import { IoPersonRemove } from 'react-icons/io5';

import { doFollow, doUnFollow, getIsFollowing } from '../../graphql';
import { useSession } from '../../../context/SessionProvider';

export const FollowMe = ({ username }) => {
  const session = useSession();
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    getIsFollowing(username).then((res) => {
      setFollowing(res?.isFollowing?.following);
    });
  }, []);

  const doFollowOrUnfollow = async () => {
    if (!session?.user?.avatar) {
      session.showLogin(true);
      return;
    }
    if (!!following) {
      await doUnFollow(username);
      setFollowing(false);
    } else {
      await doFollow(username);
      setFollowing(true);
    }
  };

  if (session?.user?.username === username) return null;

  return (
    <>
      <button
        type="button"
        className="text-slate-800 bg-slate-200 hover:bg-slate-300 font-bold rounded-full text-sm px-5 py-2 text-center flex gap-1 items-center"
        onClick={doFollowOrUnfollow}
      >
        {following ? (
          <>
            <IoPersonRemove size={18} />
          </>
        ) : (
          <>
            <IoMdPersonAdd size={18} /> <span>Follow</span>
          </>
        )}
      </button>
    </>
  );
};
