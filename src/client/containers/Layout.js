import React, { Component } from "react";

export default function Layout(Element, { settings, type }) {
  return class extends Component {
    componentDidMount() {
      document.body.className = type;
    }

    render() {
      const props = { router: { ...this.props }, settings, type };
      return (
        <div className="main centered">
          <nav className="navbar navbar-default">
            <div className="container">Navbar here</div>
          </nav>
          <main>
            <Element {...props} />
          </main>
        </div>
      );
    }
  };
}
