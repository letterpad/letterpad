import { Result } from "antd";
import Head from "next/head";

const Expired = () => {
  return (
    <>
      <Head>
        <title>Letterpad Verification Expired</title>
      </Head>
      <Result
        status="error"
        title="Link Expired"
        subTitle="The token in the link has expired. Please retry to get a new link or contact the admin."
      />
    </>
  );
};
Expired.isStatic = true;
export default Expired;
