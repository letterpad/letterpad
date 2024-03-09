"use client";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { BiBell } from "react-icons/bi";
import { Drawer } from "ui";

import {
  CommentNewMeta,
  FollowerNewMeta,
  NotificationNode,
  PostLikeMeta,
  PostNewMeta,
  SubscriberNewMeta,
  SystemMeta,
} from "@/__generated__/__types__";
import { useNotificationQuery } from "@/__generated__/src/graphql/queries/queries.graphql";

import { NotificationItem } from "./notification";
import { useOnClickOutside } from "../../hooks/useOnClickOutisde";
import { useMarkNotificationsReadMutation } from "../../../__generated__/src/graphql/queries/mutations.graphql";

const rootUrl = process.env.NEXT_PUBLIC_ROOT_URL;

export const NotificationDropdown = () => {
  const [show, setShow] = useState(false);
  const [read, setRead] = useState(true);
  const { data: session } = useSession();
  const [{ data }] = useNotificationQuery();
  const [, markAllAsRead] = useMarkNotificationsReadMutation();
  const ref = useRef(null);

  const handleClickOutside = () => {
    setShow(false);
  };

  useOnClickOutside(ref, handleClickOutside);

  const notifications = useMemo(
    () =>
      data && isNotificationNode(data?.notifications)
        ? data.notifications.rows
        : [],
    [data]
  );

  const onShow = () => {
    setShow(!show);
    setRead(true);
    markAllAsRead({});
  };

  useEffect(() => {
    const isRead = notifications.every((n) => n.is_read);
    setRead(isRead);
  }, [notifications]);

  return (
    <div className="relative w-max mx-auto flex items-center px-2" ref={ref}>
      <button
        className="relative inline-flex items-center text-sm font-medium text-center text-gray-500 hover:text-gray-900 focus:outline-none dark:hover:text-white dark:text-gray-300"
        type="button"
        onClick={onShow}
      >
        <BiBell size={24} />

        {!read && (
          <div className="absolute block w-3 h-3 bg-red-500 border-2 border-white rounded-full -top-0.5 start-2.5 dark:border-gray-900"></div>
        )}
      </button>
      <Drawer
        show={show}
        onClose={handleClickOutside}
        title="Notifications"
        className="w-96"
        dir="right"
      >
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {notifications.length === 0 && (
            <div className="font-bold py-10">No notifications yet.</div>
          )}
          {notifications.map((notification) => {
            if (isPostLikeMeta(notification.meta)) {
              return (
                <NotificationItem
                  key={notification.notification_id}
                  link={
                    new URL(
                      `post/${notification.meta.post_slug!}`,
                      `https://${session?.user?.username}.letterpad.app`
                    ).href
                  }
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
                  link={
                    new URL(
                      `post/${notification.meta.post_slug!}`,
                      `https://${notification.meta.author_name}.letterpad.app`
                    ).href
                  }
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
                  link={
                    new URL(`@${notification.meta.follower_username!}`, rootUrl)
                      .href
                  }
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

            if (isCommentNewMeta(notification.meta)) {
              const ownPost =
                notification.meta.post_author_username ===
                session?.user?.username;
              return (
                <NotificationItem
                  key={notification.notification_id}
                  link={
                    new URL(
                      `post/${notification.meta.post_slug!}`,
                      `https://${notification.meta.post_author_username}.letterpad.app`
                    ).href
                  }
                  avatar={notification.meta.commenter_avatar}
                  time={notification.createdAt}
                  message={
                    <>
                      <Bold>{notification.meta.commenter_name}</Bold> commented
                      on {ownPost ? "your" : "the"} post -
                      <Bold>{notification.meta.post_title}</Bold>.
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

function isCommentNewMeta(meta: any): meta is CommentNewMeta {
  return meta.__typename === "CommentNewMeta";
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
