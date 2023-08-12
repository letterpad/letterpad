import RegsiterWithCaptchaProvier from "./component";

const Page = () => (
  <RegsiterWithCaptchaProvier
    recaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY}
  />
);

export default Page;
