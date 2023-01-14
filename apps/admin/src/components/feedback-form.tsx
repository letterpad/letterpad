import React, { useState } from "react";

import { Buttonv2 } from "@/components_v2/button";
import { Message } from "@/components_v2/message";
import { Modal } from "@/components_v2/modal";
import { TextArea } from "@/components_v2/textarea";

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
      <Buttonv2 size="small" onClick={showModal} variant="ghost">
        Report
      </Buttonv2>
      <Modal
        header="Report an issue"
        show={isModalVisible}
        toggle={handleCancel}
        footer={[
          <Buttonv2 key="back" onClick={handleCancel} variant="ghost">
            Cancel
          </Buttonv2>,
          <Buttonv2
            key="submit"
            variant="primary"
            onClick={handleOk}
            disabled={processing}
          >
            Submit
          </Buttonv2>,
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
