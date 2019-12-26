import React from "react";
import apolloClient from "../shared/apolloClient";
import { TypeWrappedComponent } from "./types";

export default function withSSR(
  WrappedComponent,
): React.ComponentType<any> & {
  getInitialProps?: TypeWrappedComponent["getInitialProps"];
} {
  class Page extends React.Component<any, any> {
    static getInitialProps(ctx) {
      // Need to call the wrapped components getInitialProps if it exists, else
      // we just return null
      return WrappedComponent.getInitialProps
        ? WrappedComponent.getInitialProps(ctx)
        : Promise.resolve(null);
    }

    // Set out component's displayName. This just makes debugging easier.
    // Components will show as Page(MyComponent) in react-dev-tools.
    static displayName = `withSSR(${getDisplayName(WrappedComponent)})`;

    constructor(props) {
      super(props);
      this.state = {
        data: props.initialProps,
        isLoading: !!props.initialProps,
      };
    }

    componentDidMount() {
      if (!this.state.data) {
        // This will NOT run on initial server render, because this.state.data
        // will exist. However, we want to call this on all subsequent client
        // route changes
        this.fetchData();
      }
    }

    fetchData = () => {
      // if this.state.data is undefined, that means that the we are on the client.
      // To get the data we need, we just call getInitialProps again. We pass
      // it react-router's match, as well as an apolloclient instance. As req and res
      // don't exist in browser-land, they are omitted.
      this.setState({ isLoading: true });
      Page.getInitialProps({
        match: this.props.match,
        client: apolloClient(),
      }).then(
        data => this.setState({ data, isLoading: false }),
        error =>
          this.setState({
            // We can gracefully expose errors on the client, by also keeping
            // them in state.
            data: { error },
            isLoading: false,
          }),
      );
    };

    render() {
      // Just like Next.js's `getInitialProps`, we flatten out this.state.data.
      // However, one big difference from next, is that we do NOT block client
      // transitions. So we passing `isLoading` down. Finally, we pass down
      // this.fetchData so it is available to routes that need to do force
      // refreshes. For example, sibling routes that need to call
      // componentDidUpdate(), can then just refetch().
      const { initialData, ...rest } = this.props;
      return (
        <WrappedComponent
          {...rest}
          refetch={this.fetchData}
          isLoading={this.state.isLoading}
          initialProps={this.state.data}
        />
      );
    }
  }

  return Page;
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}
