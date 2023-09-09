import { Button, Modal } from "ui";

import { useGetSubscribers } from "@/app/subscribers/_feature/client.api";

export const PublishAndEmailConfirmModal = ({
  visible,
  cancelModal,
  publishOrUnpublish,
}) => {
  const { data, fetching } = useGetSubscribers();
  return (
    <Modal
      // className={error}
      header="Confirm Publish And Email"
      show={!!visible}
      size="sm"
      toggle={cancelModal}
      footer={[
        <Button
          key="back"
          onClick={cancelModal}
          variant="ghost"
          data-testid="cancelModalBtn"
        >
          Cancel
        </Button>,
        <Button
          key="submit"
          variant="primary"
          onClick={() => {
            cancelModal();
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
            publishOrUnpublish({ testMail: true });
          }}
          disabled={false}
        >
          Test Email
        </Button>,
      ]}
    >
      This action is going to publish your post to{" "}
      <strong>{data?.subscribers.count} subscribers</strong>. <br />
      <br />
      Make sure that there are no typos in the title and description and that
      you have an aesthetic cover image.
    </Modal>
  );
};
