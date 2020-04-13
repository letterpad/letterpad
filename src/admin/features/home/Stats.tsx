import Card from "../../components/card";
import { QUERY_STATS } from "../../../shared/queries/Queries";
import React from "react";
import { StatsQuery } from "../../../__generated__/gqlTypes";
import StyledIcon from "../../components/icon";
import StyledLink from "../../components/link";
import StyledList from "../../components/list";
import { translate } from "react-i18next";
import { useQuery } from "react-apollo";

interface IStatsProps {
  t: (name: string) => string;
}

const Stats: React.FC<IStatsProps> = ({ t }) => {
  const { loading, data } = useQuery<StatsQuery>(QUERY_STATS, {
    fetchPolicy: "no-cache",
  });
  return (
    <Card title={t("home.stats")} subtitle={t("home.stats.tagline")}>
      {loading ? (
        <span>...</span>
      ) : (
        <StyledList>{data && getStats(data.stats)}</StyledList>
      )}
    </Card>
  );
};

export default translate("translations")(Stats);

function getStats(stats) {
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

  return data;
}
