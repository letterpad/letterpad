import { Alert } from "antd";
import { useContext } from "react";
import CustomLayout from "../layouts/Layout";
import { LetterpadContext } from "../context/LetterpadProvider";
import { Content } from "antd/lib/layout/layout";

const ErrorMessage = ({ title, description }) => {
  const settings = useContext(LetterpadContext);
  if (!settings) return null;
  return (
    <CustomLayout settings={settings}>
      <Content style={{ margin: "24px 16px 0" }}>
        <Alert
          showIcon={true}
          message={title}
          description={description}
          type="error"
        />
      </Content>
    </CustomLayout>
  );
};

export default ErrorMessage;
