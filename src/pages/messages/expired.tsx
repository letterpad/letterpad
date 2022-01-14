import { Result } from "antd";

const Expired = () => {
  return (
    <Result
      status="error"
      title="Link Expired"
      subTitle="The token in the link has expired. Please retry to get a new link or contact the admin."
    />
  );
};

export default Expired;
