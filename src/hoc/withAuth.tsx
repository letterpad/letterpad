import { useSession } from "next-auth/client";
import { useEffect } from "react";
import { useRouter } from "next/router";

const withAuthCheck = <T extends object>(
  WrappedComponent: React.ComponentType<T>,
) => {
  return (props: T) => {
    const [session, loading] = useSession();
    const router = useRouter();
    useEffect(() => {
      if (!session && !loading) {
        router.push("/api/auth/signin");
      }
    }, [loading]);

    if (!session) return null;
    return <WrappedComponent {...props} />;
  };
};

export default withAuthCheck;
