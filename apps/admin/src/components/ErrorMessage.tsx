import { Alert } from "antd";

import { Content } from "@/components_v2/content";

const ErrorMessage = ({ title, description }) => {
  return (
    <Content>
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
