import { IMenu, TypeSettings } from "../../../client/types";
import React, { Component } from "react";
import StyledMenu, { MenuItem, StyledHeading, StyledLink } from "./Menu.css";
import { WithNamespaces, translate } from "react-i18next";

import DATA from "./data";
import { IAdminMenu } from "../../../types/types";
import PropTypes from "prop-types";
import { RouteComponentProps } from "react-router";
import { StatsQuery } from "../../../__generated__/gqlTypes";
import jwtDecode from "jwt-decode";

interface IProps extends WithNamespaces {
  settings: TypeSettings;
  router: RouteComponentProps;
  stats: StatsQuery;
}
class Menu extends Component<IProps, any> {
  permissions =
    typeof localStorage !== "undefined"
      ? jwtDecode(localStorage.token).permissions
      : [];

  render() {
    const { t, router, stats } = this.props;
    const selected = router.match.path;
    return (
      <StyledMenu className="custom-menu">
        {buildMenu(DATA, selected, this.permissions, t, stats)}
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
              buildMenu(item.children, selected, permissions, t, stats)
            ) : (
              <StyledLink
                className={isActive ? "active" : ""}
                data-id={item.id}
                to={slug}
              >
                {/* {item.icon && <i className={"menu-icon fa " + item.icon} />} */}
                <span className="name">{t(item.name)}</span>
                <span className="stats-item">
                  {item.slug === "posts" && stats.stats?.posts?.published}
                  {item.slug === "pages" && stats.stats?.pages?.published}
                  {item.slug === "tags" && stats.stats?.tags}
                  {item.slug === "categories" && stats.stats?.categories}
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
