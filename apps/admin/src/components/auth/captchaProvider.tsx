import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_KEY;

export const CaptchaProvider = ({ children }) => {
  if (!recaptchaKey) return children;
  return (
    <GoogleReCaptchaProvider reCaptchaKey={recaptchaKey}>
      {children}
    </GoogleReCaptchaProvider>
  );
};
