import { SessionData } from "@/graphql/types";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { useEffect } from "react";

const withAuthCheck = <T extends object>(
  WrappedComponent: React.ComponentType<T>,
) => {
  const ComponentWithAuth = (props: T) => {
    const [session, loading] = useSession();
    const router = useRouter();
    useEffect(() => {
      const _session = session as unknown as { user: SessionData };
      if (!loading && !_session?.user?.id) {
        router.push("/api/auth/signin");
      }
    }, [loading]);

    if (!session) return null;
    return <WrappedComponent {...props} />;
  };
  ComponentWithAuth.needsAuth = true;
  ComponentWithAuth.layout = null;
  return ComponentWithAuth;
};
export default withAuthCheck;
