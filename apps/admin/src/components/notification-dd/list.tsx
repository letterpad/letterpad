"use client";
import { useRef, useState } from "react";
import { BiBell } from "react-icons/bi";

import {
  FollowerNewMeta,
  NotificationNode,
  PostLikeMeta,
  PostNewMeta,
  SubscriberNewMeta,
  SystemMeta,
} from "@/__generated__/__types__";
import { useNotificationQuery } from "@/__generated__/src/graphql/queries/queries.graphql";

import { NotificationItem } from "./notification";
import { Drawer } from "../client-wrapper";
import { useOnClickOutside } from "../../hooks/useOnClickOutisde";

interface Session {
  name: string;
  avatar: string;
}

export const NotificationDropdown = () => {
  const [show, setShow] = useState(false);
  const [{ data }] = useNotificationQuery();
  const ref = useRef(null);

  const handleClickOutside = () => {
    setShow(false);
  };

  useOnClickOutside(ref, handleClickOutside);

  const notifications = isNotificationNode(data?.notifications)
    ? data.notifications.rows
    : [];

  return (
    <div className="relative w-max mx-auto flex items-center px-2" ref={ref}>
      <div className="relative">
        <button
          className="relative inline-flex items-center text-sm font-medium text-center text-gray-500 hover:text-gray-900 focus:outline-none dark:hover:text-white dark:text-gray-400"
          type="button"
          onClick={() => setShow(!show)}
        >
          <BiBell size={24} />

          <div className="absolute block w-3 h-3 bg-red-500 border-2 border-white rounded-full -top-0.5 start-2.5 dark:border-gray-900"></div>
        </button>
        <Drawer
          show={show}
          onClose={handleClickOutside}
          title="Notifications"
          className="w-96"
          dir="right"
        >
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {notifications.map((notification) => {
              if (isPostLikeMeta(notification.meta)) {
                return (
                  <NotificationItem
                    key={notification.notification_id}
                    link={notification.meta.post_slug}
                    avatar={notification.meta.author_avatar}
                    time={notification.createdAt}
                    message={
                      <>
                        <Bold>{notification.meta.author_name}</Bold> liked your
                        post
                      </>
                    }
                  />
                );
              }

              if (isPostNewMeta(notification.meta)) {
                return (
                  <NotificationItem
                    key={notification.notification_id}
                    link={notification.meta.post_slug}
                    avatar={notification.meta.author_avatar}
                    time={notification.createdAt}
                    message={
                      <>
                        <Bold>{notification.meta.author_name}</Bold> published a
                        new post
                      </>
                    }
                  />
                );
              }

              if (isFollowerNewMeta(notification.meta)) {
                return (
                  <NotificationItem
                    key={notification.notification_id}
                    link={notification.meta.follower_username}
                    avatar={notification.meta.follower_avatar}
                    time={notification.createdAt}
                    message={
                      <>
                        <Bold>{notification.meta.follower_name}</Bold> started
                        following you
                      </>
                    }
                  />
                );
              }

              if (isSubscriberNewMeta(notification.meta)) {
                return (
                  <NotificationItem
                    key={notification.notification_id}
                    time={notification.createdAt}
                    link="/"
                    avatar={"https://www.gravatar.com/avatar/"}
                    message={
                      <>
                        <Bold>{notification.meta.subscriber_email}</Bold>{" "}
                        subscribed to your blog
                      </>
                    }
                  />
                );
              }

              if (isSystemMeta(notification.meta)) {
                return (
                  <NotificationItem
                    key={notification.notification_id}
                    link={notification.meta.url}
                    time={notification.createdAt}
                    message={notification.meta.message}
                    avatar={"https://www.gravatar.com/avatar/"}
                  />
                );
              }
            })}
          </div>
        </Drawer>
      </div>
    </div>
  );
};

function isNotificationNode(node: any): node is NotificationNode {
  return node?.__typename === "NotificationNode";
}

function isPostLikeMeta(meta: any): meta is PostLikeMeta {
  return meta.__typename === "PostLikeMeta";
}

function isPostNewMeta(meta: any): meta is PostNewMeta {
  return meta.__typename === "PostNewMeta";
}

function isFollowerNewMeta(meta: any): meta is FollowerNewMeta {
  return meta.__typename === "FollowerNewMeta";
}

function isSubscriberNewMeta(meta: any): meta is SubscriberNewMeta {
  return meta.__typename === "SubscriberNewMeta";
}

function isSystemMeta(meta: any): meta is SystemMeta {
  return meta.__typename === "SystemMeta";
}

const Bold = ({ children }) => {
  return (
    <span className="font-semibold text-gray-900 dark:text-white">
      {children}
    </span>
  );
};
