import React, { Component } from "react";

import Navbar from "../features/navbar";
import Footer from "../features/footer";
import Header from "../features/header";

export default function Layout(ComponentClass, props) {
  const settings = props.settings;

  return class extends Component {
    state = {
      sidebarOpen: true,
    };

    mounted = false;

    componentDidMount() {
      this.mounted = true;
      if (typeof window !== "undefined") {
        window.addEventListener("resize", this.onResize);

        this.onResize();
      }
    }

    componentWillUnmount() {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", this.onResize);
      }
    }

    toggleSidebar = e => {
      if (e.type == "mouseover") {
        document.body.classList.add("hovering");
      } else {
        document.body.classList.remove("hovering");
      }
    };

    onResize = () => {
      if (!this.mounted) return false;
      if (document.body.clientWidth < 991) {
        this.setState({ sidebarOpen: false });
      } else {
        this.setState({ sidebarOpen: true });
      }
    };

    sidebarToggle = () => {
      this.setState({ sidebarOpen: !this.state.sidebarOpen });
    };

    render() {
      const _props = { ...this.props, ...props, settings };
      const classes = this.state.sidebarOpen ? "" : " collapsed";
      return (
        <div className={"main two-column" + classes}>
          <Header
            sidebarToggle={this.sidebarToggle}
            settings={settings}
            author={_props.author}
          />
          <nav className="navbar navbar-custom">
            <div className="sidebar">
              <Navbar settings={settings} router={{ ...this.props }} />
              <Footer data={settings.site_footer.value} />
            </div>
          </nav>
          <main>
            <div className="content-area">
              <ComponentClass {..._props} />
            </div>
          </main>
        </div>
      );
    }
  };
}
