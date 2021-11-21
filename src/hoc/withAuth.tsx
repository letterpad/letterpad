import { SessionData } from "@/graphql/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

const withAuthCheck = <T extends object>(
  WrappedComponent: React.ComponentType<T>,
) => {
  const ComponentWithAuth = (props: T) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    useEffect(() => {
      const _session = session as unknown as { user: SessionData };
      if (!status && !_session?.user?.id) {
        router.push("/api/auth/signin");
      }
    }, [status]);

    if (!session) return null;
    return <WrappedComponent {...props} session={session.user} />;
  };
  ComponentWithAuth.needsAuth = true;
  ComponentWithAuth.layout = null;
  return ComponentWithAuth;
};
export default withAuthCheck;
