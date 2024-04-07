"use client";

import {
  useAboutStatsQuery,
  useGetFollowersQuery,
  useGetFollowingQuery,
} from "letterpad-graphql/hooks";
import Link from "next/link";
import { useState } from "react";
import { Button, DialogModal, Modal } from "ui";

export const AboutStats = ({ username, id }) => {
  const [showModal, setShowModal] = useState<"followers" | "following" | null>(
    null
  );
  const [{ data, fetching }] = useAboutStatsQuery({ variables: { username } });
  const [followers, refetchFollowers] = useGetFollowersQuery({
    variables: { id },
    pause: true,
  });
  const [following, refetchFollowing] = useGetFollowingQuery({
    variables: { id },
    pause: true,
  });

  return (
    <>
      <div className="flex items-center gap-6">
        <MetricItem
          title="Posts"
          value={data?.aboutStats.stats?.postCount}
          onClick={() => {}}
          className={"cursor-pointer"}
        />

        <DialogModal
          title="Followers"
          trigger={
            <MetricItem
              title="Followers"
              value={data?.aboutStats.stats?.followerCount}
              onClick={() => {
                setShowModal("followers");
                refetchFollowers();
              }}
              className={"cursor-pointer"}
            />
          }
          footer={[
            <Button size="small" onClick={() => setShowModal(null)}>
              Close
            </Button>,
          ]}
        >
          <FollowList
            data={followers.data?.followers?.rows}
            loading={fetching}
          />
        </DialogModal>

        <DialogModal
          title="Following"
          trigger={
            <MetricItem
              title="Following"
              value={data?.aboutStats.stats?.followingCount}
              onClick={() => {
                setShowModal("following");
                refetchFollowing();
              }}
              className={"cursor-pointer"}
            />
          }
          footer={[
            <Button size="small" onClick={() => setShowModal(null)}>
              Close
            </Button>,
          ]}
        >
          <FollowList
            data={following.data?.following?.rows}
            loading={fetching}
          />
        </DialogModal>
      </div>
    </>
  );
};

const MetricItem = ({ title, value, onClick, className }) => {
  return (
    <div
      className={"flex items-center gap-2 text-sm md:text-base " + className}
      onClick={onClick}
    >
      <p className="block antialiased leading-relaxed text-inherit  font-bold">
        {value}
      </p>
      <p className="block antialiased leading-relaxed text-inherit font-normal">
        {title}
      </p>
    </div>
  );
};

const FollowList = ({ data, loading }) => {
  return (
    <div>
      {loading && <p>Loading...</p>}
      {!loading && data && (
        <div className="w-full">
          <div className="flow-root">
            <ul
              role="list"
              className="divide-y divide-gray-200 dark:divide-gray-700 overflow-y-scroll h-96"
            >
              {data?.map((follower) => {
                return (
                  <li className="py-3 sm:py-4">
                    <Link href={`/@${follower.username}`}>
                      <div className="flex items-center ">
                        <div className="flex-shrink-0">
                          <img
                            className="w-8 h-8 rounded-full"
                            src={follower.avatar}
                            alt="Thomas image"
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                        <div className="flex-1 min-w-0 ms-4">
                          <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                            {follower.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                            {follower.username}
                          </p>
                        </div>
                        <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white"></div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
