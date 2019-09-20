import React from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";

import StyledCard from "../../components/card";
import StyledList from "../../components/list";
import StyledIcon from "../../components/icon";
import StyledLink from "../../components/link";

const Stats = ({ stats, loading, t }) => {
  const items = [
    {
      label: "Posts",
      value: stats.posts.published,
      icon: "bookmarks",
      link: "/admin/posts",
    },
    {
      label: "Pages",
      value: stats.pages.published,
      icon: "insert_drive_file",
      link: "/admin/pages",
    },
    {
      label: "Tags",
      value: stats.tags,
      icon: "label",
      link: "/admin/tags",
    },
    {
      label: "Categories",
      value: stats.categories,
      icon: "folder",
      link: "/admin/categories",
    },
  ];

  const data = items.map((item, idx) => (
    <li key={idx}>
      <StyledIcon name={item.icon} />
      <StyledLink normal to={item.link}>
        <span>{item.value}</span>
        &nbsp;&nbsp;
        <span>{item.label}</span>
      </StyledLink>
    </li>
  ));

  return (
    <StyledCard title={t("home.stats")} subtitle={t("home.stats.tagline")}>
      {loading ? <span>...</span> : <StyledList>{data}</StyledList>}
    </StyledCard>
  );
};

Stats.propTypes = {
  loading: PropTypes.bool,
  stats: PropTypes.object,
  t: PropTypes.func,
};
Stats.defaultProps = {
  stats: {
    posts: {},
    pages: {},
  },
};

export default translate("translations")(Stats);
