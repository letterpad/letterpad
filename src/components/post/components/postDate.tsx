import { Row } from "antd";

import { getReadableDate } from "@/shared/utils";

const PostDate: React.VFC<{ date: Date }> = ({ date }) => {
  return (
    <Row justify="center" style={{ paddingBottom: 20 }}>
      {getReadableDate(date)}
    </Row>
  );
};

export default PostDate;
