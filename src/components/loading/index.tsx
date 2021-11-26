import { Row } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const Loading = () => {
  return (
    <Row align="middle" justify="start" style={{ paddingLeft: 20 }}>
      <LoadingOutlined />
      &nbsp;&nbsp;Loading...
    </Row>
  );
};

export default Loading;
