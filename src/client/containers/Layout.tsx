import React from "react";
import { TypeSettings } from "../Routes";
import ApolloClient from "apollo-client";
import { RouteComponentProps } from "react-router";

interface ILayoutProps<T> {
  type: string;
  settings: TypeSettings;
  client: ApolloClient<any>;
  router: RouteComponentProps;
  Renderer: React.ComponentType<T>;
}

class Layout extends React.Component<ILayoutProps<any>> {
  render() {
    const { Renderer, ...props } = this.props;
    return (
      <div className="main centered">
        <nav className="navbar navbar-default">
          <div className="container">Navbar here</div>
        </nav>
        <main>
          <Renderer {...props} />;
        </main>
      </div>
    );
  }
}

export default Layout;
