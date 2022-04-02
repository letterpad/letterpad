import { Result } from "antd";
const Unsubscribed = () => {
  if (typeof document === "undefined") {
    return null;
  }
  const queryParams = new URLSearchParams(document.location.search);
  const msg =
    queryParams.get("msg") || "Your email has been removed from our system";
  return <Result status="success" title="Unsubscribed" subTitle={msg} />;
};

Unsubscribed.noSession = true;
export default Unsubscribed;
