import React, { Component } from "react";
import { NavLink, RouteComponentProps } from "react-router-dom";
import { Link } from "react-router-dom";
import config from "letterpad-src/config";
import Search from "letterpad-src/client/helpers/Search";
import SiteHeader from "../styled/SiteHeader";
import { SiteLogo } from "../styled/common";
import SocialIconsStyled from "../styled/SocialIcons";
import StyledMenu from "../styled/StyledMenu";
import styled from "styled-components";
import { TypeSettings } from "letterpad-src/client/types";

const StyledThemeChange = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 30px;
  border-radius: 4px;
  div {
    width: 20px;
    height: 20px;
    cursor: pointer;
    margin-right: 8px;
    &.night {
      background: #333;
    }
    &.day {
      background: #fff;
    }
  }
`;

const SocialIcons: React.FC<{ settings: TypeSettings }> = ({ settings }) => {
  const socialIcons = Object.keys(settings)
    // get all the settings with start with "social_"
    .filter(
      setting =>
        setting.indexOf("social_") === 0 && settings[setting].value.length > 0,
    )
    .map(setting => {
      const icon = "icon icon-" + setting.split("_")[1];
      return (
        <li key={setting} className="social-item">
          <a
            target="_blank"
            rel="noopener"
            href={settings[setting].value}
            title={setting}
          >
            <span className={icon} />
          </a>
        </li>
      );
    });
  return <ul className="social-list">{socialIcons}</ul>;
};

interface IHeaderProps {
  settings: TypeSettings;
  router: RouteComponentProps;
  switchTheme: (name: string) => void;
}

class Header extends Component<IHeaderProps, any> {
  state = {
    menuOpen: false,
  };

  toggleMenu() {
    this.setState({
      menuOpen: !this.state.menuOpen,
    });
  }

  render() {
    const { settings, switchTheme } = this.props;
    const menu = JSON.parse(settings.menu.value);
    const menucollapsedClass = this.state.menuOpen ? "" : "collapsed";
    const logo = settings.site_logo.value || null;

    return (
      <SiteHeader className="site-header">
        {logo && (
          <Link to="/">
            <SiteLogo>
              <img
                src={config.baseName + settings.site_logo.value}
                alt="Logo"
                className="site_logo"
              />
            </SiteLogo>
          </Link>
        )}
        {!logo && (
          <div>
            <Link to="/">
              <h1 className="title">{settings.site_title.value}</h1>
            </Link>
            <p className="subtitle">{settings.site_tagline.value}</p>
          </div>
        )}
        <button className="menu-toggle" type="button" onClick={this.toggleMenu}>
          <span
            className={
              "icon " + (this.state.menuOpen ? "icon-close" : "icon-menu")
            }
          />
        </button>

        <Search history={this.props.router.history} />
        <StyledMenu className={"site-menu " + menucollapsedClass}>
          <ul className="menu-list">
            {menu.map((item, i) => {
              const { to, title } = getLinkAndTitle(item, i);
              return (
                <li className="menu-item" key={i}>
                  <NavLink
                    to={to}
                    className="normal"
                    activeClassName="is-active"
                    exact
                  >
                    {title}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </StyledMenu>

        <SocialIconsStyled className={"social-menu " + menucollapsedClass}>
          <StyledThemeChange>
            <div className="night" onClick={() => switchTheme("dark")} />
            <div className="day" onClick={() => switchTheme("light")} />
          </StyledThemeChange>
          <h2 className="offscreen">Social Networks</h2>
          <SocialIcons settings={settings} />
        </SocialIconsStyled>
      </SiteHeader>
    );
  }
}
export default Header;

function getLinkAndTitle(item, i) {
  let { title } = item;
  let to = "/posts/" + item.slug;

  if (item.type === "page") {
    to = "/page/" + item.slug;
  }
  if (i === 0) {
    title = "Home";
    to = "/";
  }
  return { to, title };
}
