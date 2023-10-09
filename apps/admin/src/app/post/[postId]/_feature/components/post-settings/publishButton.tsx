import { useRef, useState } from "react";
import { Button, Modal } from "ui";

import { PostVersion } from "@/lib/versioning";

import {
  Navigation,
  NavigationType,
  PostStatusOptions,
  PostTypes,
} from "@/__generated__/__types__";
import { EventAction, track } from "@/track";
import { isTagsNode } from "@/utils/type-guards";
import { parseDrafts } from "@/utils/utils";

import {
  PageNotLinkedWithNavigation,
  TagNotLinkedWithNavigation,
  WarnNoTags,
} from "./warnings";
import { useGetPost, useUpdatePost } from "../../api.client";
import { usePostContext } from "../../context";
import { usePostVersioning } from "../../hooks";

import { PostHistoryItem } from "@/types";

interface Props {
  postId: number;
  menu: Navigation[];
}

enum NotPublished {
  NoTags = "NoTags",
  TagsNotLinkedWithNav = "TagsNotLinkedWithNav",
  PageNotLinkedWithNav = "PageNotLinkedWithNav",
}

const PublishButton: React.FC<Props> = ({ postId, menu }) => {
  const [error, setError] = useState<NotPublished>();
  const { data: post, fetching: loading } = useGetPost({ id: postId });
  const { updatePost } = useUpdatePost();

  const { versionManager, refetch } = usePostVersioning(postId);

  if (post?.__typename !== "Post") return null;

  const validateAndPublish = () => {
    const isPost = post.type === PostTypes.Post;

    const navigationTags = getTagsFromMenu(menu);
    const navigationPages = getPagesFromMenu(menu);
    const postTags = isTagsNode(post.tags) ? post.tags.rows : [];

    const navLinkedWithTags = postTags.find((tag) =>
      navigationTags?.includes(tag.name.toLowerCase())
    );
    const navLinkedWithPages = navigationPages?.find(
      (page) => page === post.slug?.replace("/page/", "").toLowerCase()
    );

    if (postTags.length === 0 && isPost) {
      setError(NotPublished.NoTags);
    } else if (!navLinkedWithTags && isPost) {
      setError(NotPublished.TagsNotLinkedWithNav);
    } else if (!navLinkedWithPages && !isPost) {
      setError(NotPublished.PageNotLinkedWithNav);
    } else {
      publishOrUnpublish(true);
    }
  };

  const publishOrUnpublish = async (active: boolean) => {
    const status = active
      ? PostStatusOptions.Published
      : PostStatusOptions.Draft;

    if (active) {
      track({
        eventAction: EventAction.Click,
        eventCategory: "post status",
        eventLabel: "publish",
      });
    }
    if (status === PostStatusOptions.Published) {
      const pv = new PostVersion(parseDrafts(post?.html_draft));
      const activeVersion = pv.retrieveActiveVersion();
      if (activeVersion) {
        await updatePost({
          id: postId,
          status,
          version: activeVersion.timestamp,
        });
      }
    } else {
      await updatePost({ id: postId, status });
    }
    refetch();
  };

  const published = post.status === PostStatusOptions.Published;

  return (
    <>
      <div className="flex flex-col gap-4">
        {!published && (
          <>
            <label>Ready to publish your {post.type} ?</label>
            <Button
              variant="success"
              size="normal"
              onClick={validateAndPublish}
              data-testid="publishBtn"
              className="button btn-success"
            >
              Publish
            </Button>
          </>
        )}
        {published && (
          <>
            <label className="flex flex-col">
              Unpublish this {post.type} ? &nbsp;
              <span className="help-text mb-4 block">
                Your {post.type} will no longer be visible to users.
              </span>
              <div className="flex flex-row gap-2">
                {versionManager.getStatus() === "update-live" && (
                  <Button
                    variant="dark"
                    onClick={() => publishOrUnpublish(true)}
                  >
                    Update Live Post
                  </Button>
                )}
                <Button
                  variant="dark"
                  onClick={() => publishOrUnpublish(false)}
                  data-testid="unPublishBtn"
                >
                  Un-Publish
                </Button>
              </div>
            </label>
          </>
        )}
      </div>
      <Modal
        className={error}
        header="Post not published"
        show={!!error}
        toggle={() => setError(undefined)}
        footer={[
          <Button
            key="back"
            onClick={() => setError(undefined)}
            variant="ghost"
            data-testid="cancelModalBtn"
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            variant="primary"
            onClick={() => {
              setError(undefined);
              publishOrUnpublish(true);
            }}
            disabled={false}
          >
            Publish Anyway
          </Button>,
        ]}
      >
        {error === NotPublished.NoTags && <WarnNoTags />}
        {error === NotPublished.TagsNotLinkedWithNav && (
          <TagNotLinkedWithNavigation tags={getTagsFromMenu(menu)} />
        )}
        {error === NotPublished.PageNotLinkedWithNav && (
          <PageNotLinkedWithNavigation />
        )}
      </Modal>
    </>
  );
};

export default PublishButton;

function getTagsFromMenu(menu: Navigation[]) {
  return menu
    .filter((a) => a.type === NavigationType.Tag)
    .map((a) => a.slug.replace("/tag/", "").toLowerCase());
}

function getPagesFromMenu(menu: Navigation[]) {
  return menu
    .filter((a) => a.type === NavigationType.Page)
    .map((a) => a.slug.replace("/page/", "").toLowerCase());
}
