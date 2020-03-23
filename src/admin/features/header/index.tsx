import React, { Component } from "react";
import { Setting, SettingOptions } from "../../../__generated__/gqlTypes";

import { IAuthor } from "../../../types/types";
import { Link } from "react-router-dom";
import StyledHeader from "./Header.css";
import StyledLink from "../../components/link";
import User from "./User";
import styled from "styled-components";

interface IProps {
  settings: { [option in SettingOptions]: Setting };
  sidebarToggle: () => void;
  author: IAuthor;
  switchTheme: (theme: string) => void;
  selectedTheme: string;
}

class Header extends Component<IProps, any> {
  render() {
    const { settings, selectedTheme } = this.props;
    const themeClass = selectedTheme;
    const themeIconclass =
      selectedTheme === "light"
        ? "wrapper dark fa fa-inverse fa-moon-o"
        : "wrapper  light fa fa-inverse fa-sun-o";
    const nextTheme = selectedTheme === "dark" ? "light" : "dark";
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
          <StyledThemeChooser active={selectedTheme}>
            <div
              className={themeClass}
              onClick={() => this.props.switchTheme(nextTheme)}
            >
              <i className={themeIconclass} />
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

const StyledThemeChooser = styled.div<any>`
  display: flex;
  align-items: center;
  margin-right: 10px;
  border-right: 1px solid var(--color-border);
  padding-right: 8px;
  i {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-weight: bold;
    &.light {
      color: orange;
    }
    &.dark {
      color: #000;
    }
    &:hover {
      font-weight: bold;
    }
  }
`;
