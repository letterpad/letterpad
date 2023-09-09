import { useState } from "react";
import { Button } from "ui";

import {
  Navigation,
  PostStatusOptions,
  PostTypes,
} from "@/__generated__/__types__";
import { EventAction, track } from "@/track";
import { isTagsNode } from "@/utils/type-guards";

import { PostNotPublishedModal } from "./modals/postNotPublishedModal";
import { PublishAndEmailConfirmModal } from "./modals/publishAndEmailConfirmModal";
import { useGetPost, useUpdatePost } from "../../api.client";
import { getPagesFromMenu, getTagsFromMenu } from "../../helpers";
import { NotPublished, PublishModals } from "../../types";

interface Props {
  postId: number;
  menu: Navigation[];
}

const PublishButton: React.VFC<Props> = ({ postId, menu }) => {
  const [error, setError] = useState<NotPublished>();
  const [modal, setModal] = useState<PublishModals>(
    error ? "PostNotPublished" : undefined
  );
  const { data: post, fetching: loading } = useGetPost({ id: postId });

  const { updatePost, updating } = useUpdatePost();

  if (loading) return <span>loading...</span>;
  if (post?.__typename !== "Post") return null;

  const navigationTags = getTagsFromMenu(menu);
  const navigationPages = getPagesFromMenu(menu);

  const validateAndPublish = async ({
    sendMail,
    testMail,
  }: {
    testMail?: boolean;
    sendMail?: boolean;
  } = {}) => {
    const isPost = post.type === PostTypes.Post;

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
      await publishOrUnpublish({ publish: true, sendMail, testMail });
    }
  };

  const publishOrUnpublish = ({ publish, sendMail, testMail }: any) => {
    let status = post.status;

    if (typeof publish !== "undefined") {
      status = publish ? PostStatusOptions.Published : PostStatusOptions.Draft;
    }

    if (publish) {
      track({
        eventAction: EventAction.Click,
        eventCategory: "post status",
        eventLabel: "publish",
      });
    }
    return updatePost({
      id: postId,
      status,
      publishOptions: { sendMail, testMail },
    });
  };

  const published = post.status === PostStatusOptions.Published;

  return (
    <>
      <div className="flex flex-col gap-4">
        {!published && (
          <>
            <label>Ready to publish your {post.type} ?</label>
            <div className="flex gap-2">
              <Button
                variant="dark"
                size="normal"
                onClick={() => setModal("EmailAndPublish")}
                data-testid="publishAndEmailBtn"
              >
                Publish And Email
              </Button>
              <Button
                variant="primary"
                size="normal"
                onClick={() => validateAndPublish()}
                data-testid="publishBtn"
                disabled={updating}
              >
                Publish Only
              </Button>
              <Button
                variant="dark"
                size="normal"
                onClick={() => validateAndPublish({ sendMail: true })}
                data-testid="testMailBtn"
              >
                Email Only
              </Button>
            </div>
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
                onClick={() => publishOrUnpublish({ publish: false })}
                data-testid="unPublishBtn"
              >
                Un-Publish
              </Button>
            </label>
          </>
        )}
      </div>
      <PostNotPublishedModal
        visible={modal === "PostNotPublished"}
        error={error}
        setError={setError}
        navigationTags={navigationTags}
        publishOrUnpublish={validateAndPublish}
      />
      <PublishAndEmailConfirmModal
        visible={modal === "EmailAndPublish"}
        cancelModal={() => setModal(undefined)}
        publishOrUnpublish={validateAndPublish}
      />
    </>
  );
};

export default PublishButton;
