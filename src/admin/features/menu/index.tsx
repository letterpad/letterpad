import React, { Component } from "react";
import { Setting, StatsQuery } from "../../../__generated__/gqlTypes";
import StyledMenu, { MenuItem, StyledHeading, StyledLink } from "./Menu.css";
import { WithNamespaces, translate } from "react-i18next";

import DATA from "./data";
import { IAdminMenu } from "../../../types/types";
import { RouteComponentProps } from "react-router";
import jwtDecode from "jwt-decode";

interface IProps extends WithNamespaces {
  settings: Setting;
  router: RouteComponentProps;
  stats: StatsQuery;
  close: () => void;
}
class Menu extends Component<IProps, any> {
  permissions =
    typeof localStorage !== "undefined"
      ? jwtDecode(localStorage.token).permissions
      : [];

  render() {
    const { t, router, stats, close } = this.props;
    const selected = router.location.pathname;
    return (
      <StyledMenu className="custom-menu">
        {buildMenu(DATA, selected, this.permissions, t, stats, close)}
      </StyledMenu>
    );
  }
}

const buildMenu = (
  items: IAdminMenu[],
  selected: string,
  permissions: string[],
  t,
  stats: StatsQuery,
  close: () => void,
) => {
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
            {item.children && item.children.length > 0 ? (
              buildMenu(item.children, selected, permissions, t, stats, close)
            ) : (
              <StyledLink
                className={isActive ? "active" : ""}
                data-id={item.id}
                to={slug}
                onClick={close}
              >
                {/* {item.icon && <i className={"menu-icon fa " + item.icon} />} */}
                <span className="name">{t(item.name)}</span>
                <span className="stats-item">
                  {item.slug === "posts" && stats.stats?.posts?.published}
                  {item.slug === "pages" && stats.stats?.pages?.published}
                  {item.slug === "tags" && stats.stats?.tags}
                  {item.slug === "media" && stats.stats?.media}
                </span>
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
