import { Button, Input, message, Modal } from "antd";
import { basePath } from "next.config";
import React, { useState } from "react";

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
      message.success({ content: responseText, key });
    } else {
      message.error({ content: responseText, key });
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
      <Button type="link" onClick={showModal}>
        Report
      </Button>
      <Modal
        title="Report an issue"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleOk}
            loading={processing}
          >
            Submit
          </Button>,
        ]}
      >
        <p>
          Hi, I am the author of <strong>Letterpad</strong> and I am
          continuiously working to improve the product. Your feedback is
          extrememly valuable for me.
        </p>
        <p>
          Help articles are in progress. In the meantime, if you have any
          questions, use this feedback form. I will reply back ASAP.
        </p>
        <Input.TextArea
          rows={10}
          placeholder="Provide your feedback here..."
          onChange={(e) => setFeedback(e.target.value)}
          value={feedback}
        ></Input.TextArea>
      </Modal>
    </>
  );
};

export default FeedbackForm;
