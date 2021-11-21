import { basePath } from "@/constants";
import { SessionProvider } from "next-auth/react";

const withSessionProvider = <T extends object>(
  WrappedComponent: React.ComponentType<T>,
) => {
  const ComponentWithSession = (props: T) => {
    return (
      <SessionProvider basePath={basePath + "/api/auth"}>
        <WrappedComponent {...props} />;
      </SessionProvider>
    );
  };

  return ComponentWithSession;
};
export default withSessionProvider;
