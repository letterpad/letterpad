import {
  Navigation,
  NavigationType,
  PostStatusOptions,
  PostWithAuthorAndTagsFragment,
} from "letterpad-graphql";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button, Modal } from "ui";

import { usePublish } from "./usePublish";
import { Heading } from "../heading";
import { PageNotLinkedWithNavigation, WarnNoTags } from "../warnings";

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
  const [busy, setBusy] = useState(false);
  const { watch } = useFormContext<PostWithAuthorAndTagsFragment>();
  const {
    publishOrUnpublish,
    validateAndPublish,
    _discardDraft,
    isPublished,
    isDirty,
  } = usePublish({
    postId,
    menu,
  });
  if (!watch("id")) return null;

  const type = watch("type");
  const status = watch("status");
  const published = status === PostStatusOptions.Published;

  return (
    <>
      <div className="flex flex-col">
        {!published && (
          <>
            <Heading
              heading={`Ready to publish your ${type} ?`}
              subheading={``}
            />
            <div>
              <Button
                size="normal"
                onClick={() => {
                  setBusy(true);
                  validateAndPublish()
                    ?.then(() => setBusy(false))
                    .catch(() => setBusy(false));
                }}
                data-testid="publishBtn"
                className="button btn-success"
                disabled={busy}
              >
                {busy ? "Publishing..." : "Publish"}
              </Button>
            </div>
          </>
        )}
        {published && (
          <>
            <Heading
              heading={`Unpublish this ${type} ?`}
              subheading={`Your ${type} will no longer be visible to users.`}
            />
            <div className="flex flex-col gap-2">
              {isPublished && isDirty ? (
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setBusy(true);
                      publishOrUnpublish(true)
                        ?.then(() => setBusy(false))
                        .catch(() => setBusy(false));
                    }}
                    className="flex-1"
                    disabled={busy}
                    variant="outline"
                  >
                    {busy ? "Updating Post..." : "Update Live Post"}
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
                    onClick={() => {
                      setBusy(true);
                      publishOrUnpublish(false)
                        ?.then(() => setBusy(false))
                        .catch(() => setBusy(false));
                    }}
                    data-testid="unPublishBtn"
                    disabled={busy}
                  >
                    Unpublish
                  </Button>
                </div>
              ) : (
                <div>
                  <Button
                    variant="danger"
                    onClick={() => {
                      setBusy(true);
                      publishOrUnpublish(false)
                        ?.then(() => setBusy(false))
                        .catch(() => setBusy(false));
                    }}
                    data-testid="unPublishBtn"
                    disabled={busy}
                  >
                    {busy ? "Unpublishing..." : "Unpublish"}
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
