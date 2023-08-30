import { useState } from "react";
import { Button, Modal } from "ui";

import {
  Navigation,
  NavigationType,
  PostStatusOptions,
  PostTypes,
} from "@/__generated__/__types__";
import { EventAction, track } from "@/track";

import {
  PageNotLinkedWithNavigation,
  TagNotLinkedWithNavigation,
  WarnNoTags,
} from "./warnings";
import { useGetPost, useUpdatePost } from "../../api.client";

interface Props {
  postId: number;
  menu: Navigation[];
}

enum NotPublished {
  NoTags = "NoTags",
  TagsNotLinkedWithNav = "TagsNotLinkedWithNav",
  PageNotLinkedWithNav = "PageNotLinkedWithNav",
}

const PublishButton: React.VFC<Props> = ({ postId, menu }) => {
  const [error, setError] = useState<NotPublished>();

  const { data: post, fetching: loading } = useGetPost({ id: postId });

  const { updatePost } = useUpdatePost();

  if (loading) return <span>loading...</span>;
  if (post?.__typename !== "Post") return null;

  const validateAndPublish = () => {
    const isPost = post.type === PostTypes.Post;

    const navigationTags = getTagsFromMenu(menu);
    const navigationPages = getPagesFromMenu(menu);
    const postTags = post.tags?.__typename === "TagsNode" ? post.tags.rows : [];

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

  const publishOrUnpublish = (active: boolean) => {
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
    updatePost({ id: postId, status });
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
              <Button
                variant="dark"
                onClick={() => publishOrUnpublish(false)}
                data-testid="unPublishBtn"
              >
                Un-Publish
              </Button>
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
