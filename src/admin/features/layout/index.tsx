import React, { Component } from "react";
import { StyledLayout, defaultStyles } from "./Layout.css";
import { darkTheme, lightTheme } from "../../css-variables";

import { IAdminLayoutProps } from "../../../types/types";
import { RouteComponentProps } from "react-router";
import Sidebar from "../sidebar";
import styled from "styled-components";

const whyDidYouRender = require("@welldone-software/why-did-you-render");
whyDidYouRender(React, {
  trackAllPureComponents: true,
});

const CSSVariables = styled.div<any>`
  ${props => (props.dark ? darkTheme : lightTheme)};
`;

const NoLayout = styled.div`
  ${defaultStyles};
`;

const Layout = (
  ComponentClass: React.ComponentType<IAdminLayoutProps>,
  props: IAdminLayoutProps,
) => {
  let defaultTheme = "dark";
  if (typeof localStorage !== "undefined" && localStorage.theme) {
    defaultTheme = localStorage.theme;
  }

  return class extends Component<RouteComponentProps> {
    state = {
      sidebarOpen: true,
      theme: defaultTheme,
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

    switchTheme = theme => {
      this.setState({ theme });
      if (typeof localStorage !== "undefined") {
        localStorage.theme = theme;
      }
    };

    render() {
      const _props = { ...props, router: { ...this.props } };
      const classes = this.state.sidebarOpen ? "" : " collapsed";
      const selectedTheme = { [this.state.theme]: true };

      if (_props.layout === "none") {
        return (
          <CSSVariables {...selectedTheme}>
            <NoLayout className={`theme-${this.state.theme}`}>
              <div className="content-area">
                <ComponentClass {..._props} theme={this.state.theme} />
              </div>
            </NoLayout>
          </CSSVariables>
        );
      }

      return (
        <CSSVariables {...selectedTheme}>
          <StyledLayout
            className={`main two-column theme-${this.state.theme}` + classes}
          >
            <Sidebar {..._props} />
            <main>
              <div className="content-area">
                <div className="sidebar-close" onClick={this.sidebarToggle}>
                  <i className="fa fa-align-justify" />
                </div>
                <ComponentClass {..._props} theme={this.state.theme} />
              </div>
            </main>
          </StyledLayout>
        </CSSVariables>
      );
    }
  };
};

export default Layout;
