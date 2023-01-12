import Head from "next/head";
import { Result } from "ui";

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
Expired.isMessage = true;
export default Expired;
