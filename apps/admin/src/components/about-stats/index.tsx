"use client";

import { useAboutStatsQuery } from "@/__generated__/src/graphql/queries/queries.graphql";

export const AboutStats = ({ username }) => {
  const [{ data }] = useAboutStatsQuery({ variables: { username } });
  return (
    <div className="flex items-center gap-6">
      <MetricItem title="Posts" value={data?.aboutStats.stats?.postCount} />
      <MetricItem
        title="Followers"
        value={data?.aboutStats.stats?.followerCount}
      />
      <MetricItem
        title="Following"
        value={data?.aboutStats.stats?.followingCount}
      />
    </div>
  );
};

const MetricItem = ({ title, value }) => {
  return (
    <div className="flex items-center gap-2 text-sm md:text-base">
      <p className="block antialiased leading-relaxed text-inherit  font-bold">
        {value}
      </p>
      <p className="block antialiased leading-relaxed text-inherit font-normal">
        {title}
      </p>
    </div>
  );
};
