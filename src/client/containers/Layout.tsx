import React, { Component } from "react";
import { ILayoutProps } from "../types";

class Layout extends Component<ILayoutProps> {
  render() {
    const { Content, ...props } = this.props;
    return (
      <div className="main centered">
        <nav className="navbar navbar-default">
          <div className="container">Navbar here</div>
        </nav>
        <main>
          <Content {...props} />;
        </main>
      </div>
    );
  }
}

export default Layout;
