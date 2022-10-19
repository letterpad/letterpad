import { Button, Modal } from "antd";
import React, { useState } from "react";

interface Props {
  title?: string;
  description: string;
  type: "success" | "info" | "warning" | "error";
  showIcon?: boolean;
  callback: (response: boolean) => void;
}
export const ConfirmPopup: React.FC<Props> = ({
  title,
  description,
  callback,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    callback(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    callback(false);
  };
  return (
    <>
      <Modal
        title={title}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {description}
      </Modal>

      <Button type="link" onClick={showModal}>
        Unlink
      </Button>
    </>
  );
};
