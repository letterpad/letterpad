import React, { Component } from "react";
import PropTypes from "prop-types";
import jwtDecode from "jwt-decode";
import DATA from "./constants";
import StyledMenu, { StyledHeading, StyledLink, MenuItem } from "./Menu.css";
import { translate } from "react-i18next";

class Menu extends Component {
  static propTypes = {
    router: PropTypes.object,
    settings: PropTypes.object,
    t: PropTypes.func,
  };

  permissions =
    typeof localStorage !== "undefined"
      ? jwtDecode(localStorage.token).permissions
      : [];

  render() {
    const { t, router } = this.props;
    const selected = router.match.path;
    return (
      <StyledMenu className="custom-menu">
        {buildMenu(DATA, selected, this.permissions, t)}
      </StyledMenu>
    );
  }
}
const buildMenu = (items, selected, permissions, t) => {
  return (
    <ul>
      {items.map(item => {
        const slug = "/admin/" + item.slug;
        const isActive = selected === slug;
        let hasPerms = checkPerm(permissions, item.permissions);

        if (!hasPerms) {
          return <div key={item.name} />;
        }
        return (
          <MenuItem key={item.name}>
            {!item.slug && <StyledHeading>{t(item.name)}</StyledHeading>}
            {item.children && item.children.length > 0 ? (
              buildMenu(item.children, selected, permissions, t)
            ) : (
              <StyledLink
                className={isActive ? "active" : ""}
                data-id={item.id}
                to={slug}
              >
                {item.icon && <i className={"menu-icon fa " + item.icon} />}
                <span className="name">{t(item.name)}</span>
              </StyledLink>
            )}
          </MenuItem>
        );
      })}
    </ul>
  );
};

const checkPerm = (userPerms, requiredPerms) => {
  let hasPerm = true;
  if (requiredPerms && requiredPerms.length > 0) {
    hasPerm = false;
    requiredPerms.map(perm => {
      if (userPerms.indexOf(perm) >= 0) {
        hasPerm = true;
      }
    });
  }
  return hasPerm;
};

export default translate("translations")(Menu);
