import { Button, Modal } from "ui";

import {
  PageNotLinkedWithNavigation,
  TagNotLinkedWithNavigation,
  WarnNoTags,
} from "../warnings";
import { NotPublished } from "../../../types";

export const PostNotPublishedModal = ({
  error,
  setError,
  publishOrUnpublish,
  navigationTags,
  visible,
}) => {
  return (
    <Modal
      className={error}
      header="Post not published"
      show={visible}
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
            publishOrUnpublish({ sendMail: true, publish: true });
          }}
          disabled={false}
        >
          Publish And Email
        </Button>,
        <Button
          key="submit"
          variant="primary"
          onClick={() => {
            setError(undefined);
            publishOrUnpublish({ publish: true });
          }}
          disabled={false}
        >
          Only Publish
        </Button>,
      ]}
    >
      {error === NotPublished.NoTags && <WarnNoTags />}
      {error === NotPublished.TagsNotLinkedWithNav && (
        <TagNotLinkedWithNavigation tags={navigationTags} />
      )}
      {error === NotPublished.PageNotLinkedWithNav && (
        <PageNotLinkedWithNavigation />
      )}
    </Modal>
  );
};
