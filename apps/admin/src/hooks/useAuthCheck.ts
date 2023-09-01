import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";

export const useAuthCheck = () => {
  const { status } = useSession();
  useEffect(() => {
    if (status === "unauthenticated") {
      signIn();
    }
  }, [status]);
};
