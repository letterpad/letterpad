import { useApolloClient } from "@/hooks/useApolloClient";
import { ApolloProvider } from "@apollo/client";

const withApolloProvider = <T extends object>(
  WrappedComponent: React.ComponentType<T>,
) => {
  const ComponentWithApollo = (props: T) => {
    const client = useApolloClient();

    if (!client) {
      return null;
    }
    return (
      <ApolloProvider client={client}>
        <WrappedComponent {...props} />
      </ApolloProvider>
    );
  };

  return ComponentWithApollo;
};
export default withApolloProvider;
