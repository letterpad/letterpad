import { signIn, signOut, useSession } from "next-auth/client";
import Posts from "./posts";

const email = "admin@letterpad.app";
const password = "12345";

const Index = () => {
  const [session, loading] = useSession();

  const handleLogin = () => {
    signIn("credentials", {
      email,
      password,
      // The page where you want to redirect to after a
      // successful login
      callbackUrl: `${window.location.origin}/protected`,
    });
  };

  return <Posts />;
};

export default Index;
