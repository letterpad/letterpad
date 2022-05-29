import { LoadingOutlined } from "@ant-design/icons";
import { Row } from "antd";

const Loading = () => {
  return (
    <Row align="middle" justify="start" style={{ paddingLeft: 20 }}>
      <LoadingOutlined />
      &nbsp;&nbsp;Loading...
    </Row>
  );
};

export default Loading;
