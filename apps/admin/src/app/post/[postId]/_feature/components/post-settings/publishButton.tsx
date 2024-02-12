import { useState } from "react";
import { Button, Message, Modal } from "ui";

import {
  Navigation,
  NavigationType,
  PostStatusOptions,
  PostTypes,
} from "@/__generated__/__types__";
import { EventAction, track } from "@/track";
import { isTagsNode } from "@/utils/type-guards";

import { Heading } from "./heading";
import { PageNotLinkedWithNavigation, WarnNoTags } from "./warnings";
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

const PublishButton: React.FC<Props> = ({ postId, menu }) => {
  const [error, setError] = useState<NotPublished>();
  const { data: post } = useGetPost({ id: postId });
  const { updatePost, fetching } = useUpdatePost();

  if (post?.__typename !== "Post") return null;

  const validateAndPublish = () => {
    const isPost = post.type === PostTypes.Post;

    const navigationPages = getPagesFromMenu(menu);
    const postTags = isTagsNode(post.tags) ? post.tags.rows : [];

    const navLinkedWithPages = navigationPages?.find(
      (page) => page === post.slug?.replace("/page/", "").toLowerCase()
    );

    if (postTags.length === 0 && isPost) {
      setError(NotPublished.NoTags);
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
    await updatePost({ id: postId, status });
  };

  const _discardDraft = async () => {
    const res = await fetch("/api/discardDraft", {
      method: "POST",
      body: JSON.stringify({ id: postId }),
    });
    if (res.status === 200) {
      Message().success({ content: "Draft discarded successfully" });
      setTimeout(() => {
        document.location.reload();
      }, 0);
    }
  };

  const published = post.status === PostStatusOptions.Published;

  return (
    <>
      <div className="flex flex-col">
        {!published && (
          <>
            <Heading
              heading={`Ready to publish your ${post.type} ?`}
              subheading={``}
            />
            <div>
              <Button
                size="normal"
                onClick={validateAndPublish}
                data-testid="publishBtn"
                className="button btn-success"
                disabled={fetching}
              >
                {fetching ? "Publishing..." : "Publish"}
              </Button>
            </div>
          </>
        )}
        {published && (
          <>
            <Heading
              heading={`Unpublish this ${post.type} ?`}
              subheading={`Your ${post.type} will no longer be visible to users.`}
            />
            <div className="flex flex-col gap-2">
              {post.status === PostStatusOptions.Published &&
              post.html !== post.html_draft ? (
                <div className="flex gap-2">
                  <Button
                    onClick={() => publishOrUnpublish(true)}
                    className="flex-1"
                    disabled={fetching}
                    variant="outline"
                  >
                    {fetching ? "Updating Post..." : "Update Live Post"}
                  </Button>
                  <Button
                    onClick={_discardDraft}
                    className="flex-1"
                    variant="outline"
                  >
                    Discard Draft
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => publishOrUnpublish(false)}
                    data-testid="unPublishBtn"
                    disabled={fetching}
                  >
                    Unpublish
                  </Button>
                </div>
              ) : (
                <div>
                  <Button
                    variant="danger"
                    onClick={() => publishOrUnpublish(false)}
                    data-testid="unPublishBtn"
                    disabled={fetching}
                  >
                    {fetching ? "Unpublishing..." : "Unpublish"}
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <Modal
        className={error}
        header="Reminder"
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
        {error === NotPublished.NoTags && <WarnNoTags postId={postId} />}
        {error === NotPublished.PageNotLinkedWithNav && (
          <PageNotLinkedWithNavigation />
        )}
      </Modal>
    </>
  );
};

export default PublishButton;

function getPagesFromMenu(menu: Navigation[]) {
  return menu
    .filter((a) => a.type === NavigationType.Page)
    .map((a) => a.slug.replace("/page/", "").toLowerCase());
}
