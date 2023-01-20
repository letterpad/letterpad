import React, { useState } from "react";
import { Button, Message, Modal, TextArea } from "ui";

import { basePath } from "@/constants";

const key = "feedback";
const FeedbackForm = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [processing, setProcessing] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    setProcessing(true);
    const response = await fetch(`${basePath}/api/sendFeedback`, {
      method: "POST",
      body: JSON.stringify({
        feedback,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    const responseText = await response.text();
    if (response.status === 200) {
      Message().success({ content: responseText });
    } else {
      Message().error({ content: responseText });
    }

    setProcessing(false);
    handleCancel();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setFeedback("");
  };

  return (
    <>
      <Button size="small" onClick={showModal} variant="ghost">
        Report
      </Button>
      <Modal
        header="Report an issue"
        show={isModalVisible}
        toggle={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel} variant="ghost">
            Cancel
          </Button>,
          <Button
            key="submit"
            variant="primary"
            onClick={handleOk}
            disabled={processing}
          >
            Submit
          </Button>,
        ]}
      >
        <p>
          Help articles are in progress and will take some time to release. In
          the meantime, if you have any questions, use this feedback form.{" "}
          <br />
          <br />
          Also, if you would like to contribute to this project, please reach
          out to me.
        </p>
        <TextArea
          rows={10}
          placeholder="Provide your feedback here..."
          onChange={(e) => setFeedback(e.target.value)}
          value={feedback}
        ></TextArea>
      </Modal>
    </>
  );
};

export default FeedbackForm;
