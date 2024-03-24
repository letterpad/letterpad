import {
  Navigation,
  NavigationType,
  PostStatusOptions,
} from "letterpad-graphql";
import { useState } from "react";
import { Button, Modal } from "ui";

import { usePublish } from "./usePublish";
import { Heading } from "../heading";
import { PageNotLinkedWithNavigation, WarnNoTags } from "../warnings";
import { useGetPost } from "../../../api.client";

interface Props {
  postId: string;
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
  const {
    publishOrUnpublish,
    validateAndPublish,
    _discardDraft,
    fetching,
    isPublished,
    isDirty,
  } = usePublish({
    postId,
    menu,
  });

  if (post?.__typename !== "Post") return null;

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
              {isPublished && isDirty ? (
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
