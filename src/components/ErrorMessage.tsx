import { Alert } from "antd";
import { Content } from "antd/lib/layout/layout";
import { useContext } from "react";

import { LetterpadContext } from "../context/LetterpadProvider";

const ErrorMessage = ({ title, description }) => {
  const settings = useContext(LetterpadContext);
  if (!settings) return null;
  return (
    <Content style={{ margin: "24px 16px 0" }}>
      <Alert
        showIcon={true}
        message={title}
        description={description}
        type="error"
      />
    </Content>
  );
};

export default ErrorMessage;
