import classNames from "classnames";
import { useEffect, useState } from "react";
import { Select } from "ui";

import {
  PostsFilters,
  PostStatusOptions,
  SortBy,
} from "@/__generated__/__types__";
import { useStatsQuery } from "@/__generated__/queries/queries.graphql";
import { PageType } from "@/graphql/types";
import { EventAction, track } from "@/track";

import Loading from "../loading";
import { useTagsContext } from "../tags/context";

interface IProps {
  showTags?: boolean;
  onChange: (filters: PostsFilters) => void;
  showPageTypes?: boolean;
  filters: PostsFilters;
  setFilters: (data: PostsFilters) => void;
}

const Filters = ({
  showTags = true,
  onChange,
  showPageTypes = false,
  filters,
  setFilters,
}: IProps) => {
  const [allTags, setAllTags] = useState<{ slug: string; name: string }[]>([]);
  const stats = useStatsQuery();
  const statsData =
    stats.data?.stats?.__typename === "Stats"
      ? stats.data.stats[showPageTypes ? "pages" : "posts"]
      : { published: 0, drafts: 0, trashed: 0 };
  const { tags, loading } = useTagsContext();

  useEffect(() => {
    if (!showTags || showPageTypes) return onChange(filters);

    if (loading || !tags) return;

    const uniqueData = [
      ...tags.reduce((map, obj) => map.set(obj.slug, obj), new Map()).values(),
    ];
    setAllTags(
      uniqueData.map((tag) => ({
        slug: tag.slug,
        name: tag.name,
      }))
    );
  }, [filters, loading, onChange, showPageTypes, showTags, tags]);

  const onBadgeClick = (status: PostStatusOptions) => {
    let newStatusFilters = [...(filters.status ?? []), status];
    if (filters.status?.includes(status)) {
      newStatusFilters = (filters.status ?? []).filter((s) => s !== status);
    }
    const changedFilters = { ...filters, status: newStatusFilters };
    setFilters(changedFilters);
    onChange({ ...changedFilters });
  };

  if (loading && showTags) return <Loading />;

  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex flex-row gap-2 text-sm">
        <Badge
          label="Published"
          count={statsData.published}
          active={filters.status?.includes(PostStatusOptions.Published)}
          onClick={() => onBadgeClick(PostStatusOptions.Published)}
        />
        <Badge
          label="Drafts"
          count={statsData.drafts}
          active={filters.status?.includes(PostStatusOptions.Draft)}
          onClick={() => onBadgeClick(PostStatusOptions.Draft)}
        />
        <Badge
          label="Trashed"
          count={statsData.trashed}
          active={filters.status?.includes(PostStatusOptions.Trashed)}
          onClick={() => onBadgeClick(PostStatusOptions.Trashed)}
        />
      </div>
      <div className="hidden grid-cols-2 items-center gap-2 md:grid ">
        <Select
          id="filters-sort"
          onChange={(key) => {
            track({
              eventAction: EventAction.Click,
              eventCategory: "filters",
              eventLabel: "sortBy",
            });
            setFilters({ ...filters, sortBy: key as SortBy });
            onChange({ ...filters, sortBy: key as SortBy });
          }}
          selected={filters.sortBy ?? "all"}
          items={[
            ...Object.values(SortBy).map((key) => ({
              key,
              label: key === SortBy.Desc ? "Latest" : "Oldest",
            })),
          ]}
        />
        {allTags && showTags && (
          <Select
            id="filters-tags"
            onChange={(key) => {
              if (key === "all") {
                const { tagSlug, ...rest } = filters;
                return setFilters({
                  ...rest,
                });
              }
              track({
                eventAction: EventAction.Click,
                eventCategory: "filters",
                eventLabel: "tagSlug",
              });
              setFilters({ ...filters, tagSlug: key });
              onChange({ ...filters, tagSlug: key });
            }}
            selected={filters.tagSlug ?? "all"}
            items={[
              { key: "all", label: "All Tags" },
              ...allTags.map((tag) => ({
                key: tag.slug,
                label: tag.name,
              })),
            ]}
          />
        )}
        {showPageTypes && (
          <Select
            id="filters-pagetypes"
            onChange={(key) => {
              if (key === "all") {
                const { tagSlug, page_type, ...rest } = filters;
                return setFilters({
                  ...rest,
                });
              }
              track({
                eventAction: EventAction.Click,
                eventCategory: "filters",
                eventLabel: "pagetype dropdown",
              });
              setFilters({
                ...filters,
                page_type: key as PageType,
                // type: PostTypes.Page,
              });
              onChange({ ...filters, page_type: key as PageType });
            }}
            selected={filters.page_type ?? "all"}
            items={[
              { key: "all", label: "All" },
              ...Object.keys(PageType).map((type) => ({
                key: PageType[type],
                label: type,
              })),
            ]}
          />
        )}
      </div>
    </div>
  );
};

export default Filters;

const Badge = ({ label, count, active, onClick }) => {
  return (
    <span
      onClick={onClick}
      className={classNames(
        "flex cursor-pointer items-center gap-2  rounded-md border-[1px] px-2 py-1",
        {
          "border-transparent bg-slate-100 text-slate-500 shadow-sm dark:bg-slate-700 dark:text-slate-400":
            !active,
          "border-slate-500 bg-slate-500  text-slate-100 dark:border-blue-700 dark:bg-blue-600 dark:text-blue-200":
            active,
        }
      )}
    >
      {label}
      <span
        className={classNames(
          "flex h-5 w-5 items-center justify-center rounded-full text-xs",
          {
            "bg-slate-200 dark:bg-slate-800": !active,
            "bg-slate-700 text-blue-100 dark:bg-blue-800 dark:text-blue-100":
              active,
          }
        )}
      >
        {count}
      </span>
    </span>
  );
};
