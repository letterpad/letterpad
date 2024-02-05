"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { RiUserFollowLine, RiUserUnfollowLine } from "react-icons/ri";
import { Button, Modal } from "ui";

import {
  useFollowAuthorMutation,
  useUnFollowAuthorMutation,
} from "@/__generated__/src/graphql/queries/mutations.graphql";
import {
  useAboutStatsQuery,
  useIsFollowingQuery,
} from "@/__generated__/src/graphql/queries/queries.graphql";

export const FollowMe = ({ username }) => {
  const session = useSession();
  const [show, setShow] = useState(false);
  const [{}, followAuthor] = useFollowAuthorMutation();
  const [{}, unFollowAuthor] = useUnFollowAuthorMutation();
  const [{}, refetchAboutStats] = useAboutStatsQuery({
    variables: { username },
    pause: true,
  });

  const [{ data }, refetch] = useIsFollowingQuery({
    variables: { username },
  });

  const doFollowOrUnfollow = async () => {
    if (!session.data?.user?.id) {
      setShow(true);
      return;
    }
    if (!!data?.isFollowing.following) {
      await unFollowAuthor({ username });
    } else {
      await followAuthor({ username });
    }
    refetch({
      requestPolicy: "network-only",
    });
    refetchAboutStats({
      requestPolicy: "network-only",
    });
  };

  return (
    <>
      <button
        type="button"
        className="text-slate-800 bg-slate-200 hover:bg-slate-300 font-bold rounded-full text-sm px-5 py-2 text-center flex gap-1 items-center"
        onClick={doFollowOrUnfollow}
      >
        {data?.isFollowing.following ? (
          <>
            <RiUserUnfollowLine size={18} /> <span>UnFollow</span>
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
