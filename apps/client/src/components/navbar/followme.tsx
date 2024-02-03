'use client';

import { useEffect, useState } from 'react';
import { RiUserFollowLine, RiUserUnfollowLine } from 'react-icons/ri';
import { Button, Modal } from 'ui';

import { doFollow, doUnFollow, getIsFollowing } from '../../graphql';
import { useSession } from '../../../context/SessionProvider';

export const FollowMe = ({ username }) => {
  const session = useSession();
  const [show, setShow] = useState(false);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    getIsFollowing(username).then((res) => {
      setFollowing(res?.isFollowing?.following);
    });
  }, []);

  const doFollowOrUnfollow = async () => {
    if (!session?.user?.avatar) {
      setShow(true);
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

  return (
    <>
      <button
        type="button"
        className="text-slate-800 bg-slate-200 hover:bg-slate-300 font-bold rounded-full text-sm px-5 py-2 text-center flex gap-1 items-center"
        onClick={doFollowOrUnfollow}
      >
        {following ? (
          <>
            <RiUserUnfollowLine size={18} />
          </>
        ) : (
          <>
            <RiUserFollowLine size={18} /> <span>Follow</span>
          </>
        )}
      </button>
      <Modal
        show={show}
        toggle={() => setShow(false)}
        header="You need to Login"
        footer={[
          <Button key="back" onClick={() => setShow(false)} variant="ghost">
            Cancel
          </Button>,
          <Button
            key="submit"
            onClick={() => {
              setShow(false);
              window.location.href = `/api/identity/login?source=${document.location.href}`;
            }}
          >
            Login
          </Button>,
        ]}
      >
        You need to be logged into Letterpad for this action.
      </Modal>
    </>
  );
};
