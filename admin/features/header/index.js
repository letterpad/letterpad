import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import styled from "styled-components";

import User from "./User";
import StyledHeader from "./Header.css";
import StyledLink from "../../components/link";

const StyledThemeChooser = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;
  border-right: 1px solid var(--color-border);
  padding-right: 8px;
  > div {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    i.light {
      color: ${p =>
        p.active == "light" && "rgba(var(--color-accent));font-weight: bold;"};
    }
    i.dark {
      color: ${p =>
        p.active == "dark" && "rgba(var(--color-accent));font-weight: bold;"};
    }
    i:hover {
      color: rgba(var(--color-accent));
      font-weight: bold;
    }
  }
`;

class Header extends Component {
  static propTypes = {
    settings: PropTypes.object,
    sidebarToggle: PropTypes.func,
    author: PropTypes.object,
    switchTheme: PropTypes.func,
    selectedTheme: PropTypes.string,
  };

  render() {
    const settings = this.props.settings;
    return (
      <StyledHeader>
        <div className="left-side">
          <button
            type="button"
            className="navbar-toggle"
            onClick={this.props.sidebarToggle}
          >
            <i className="material-icons">menu</i>
          </button>
          <Link className="navbar-brand brand" to={"/"}>
            {settings.site_title.value}
          </Link>
        </div>

        <div className="right-side">
          <StyledThemeChooser active={this.props.selectedTheme}>
            <div
              className="dark"
              onClick={() => this.props.switchTheme("dark")}
            >
              <i className="dark fa fa-moon-o" />
            </div>
            <div
              className="light"
              onClick={() => this.props.switchTheme("light")}
            >
              <i className="light fa fa-sun-o" />
            </div>
          </StyledThemeChooser>
          <StyledLink
            className="view-site"
            target="_blank"
            rel="noopener noreferrer"
            to={"/"}
          >
            View site
          </StyledLink>
          <User author={this.props.author} />
        </div>
      </StyledHeader>
    );
  }
}
export default Header;
