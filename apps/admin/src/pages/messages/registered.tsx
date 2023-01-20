import Head from "next/head";
import { useRouter } from "next/router";
import { Button, Result } from "ui";

const Registered = () => {
  const router = useRouter();

  const doLogin = () => {
    router.push("/api/auth/signin");
  };
  return (
    <>
      <Head>
        <title>Registered Successfully</title>
      </Head>
      <Result
        status="success"
        title="Registration successful"
        subTitle="Congrats! You have successfully registered with Letterpad. You will receive an email shortly from us to verify your identity."
        extra={[
          <Button key="login" onClick={doLogin}>
            Login
          </Button>,
        ]}
      />
    </>
  );
};
Registered.isMessage = true;
export default Registered;
