import React from "react";
import { ILayoutProps } from "../types";

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
