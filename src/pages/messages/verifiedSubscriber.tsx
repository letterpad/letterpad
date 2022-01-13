import { Result } from "antd";

const VerifiedSubscriber = () => {
  return (
    <Result
      status="success"
      title="Email Verified"
      subTitle="Your email has been successfully. You have been subscribed to the blog."
    />
  );
};

export default VerifiedSubscriber;
