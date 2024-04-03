import { PostsFilters, PostStatusOptions, SortBy } from "letterpad-graphql";
import { useHomeQueryQuery } from "letterpad-graphql/hooks";
import { useEffect, useState } from "react";
import {
  Select2,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  ToggleGroup,
  ToggleGroupItem,
} from "ui";

import { useGetTags } from "@/app/tags/_feature/api.client";
import { PageType } from "@/graphql/types";
import { EventAction, track } from "@/track";

interface IProps {
  showTags?: boolean;
  onChange: (filters: PostsFilters) => void;
  showPageTypes?: boolean;
  filters: PostsFilters;
  setFilters: (data: PostsFilters) => void;
}

export const Filters = ({
  showTags = true,
  onChange,
  showPageTypes = false,
  filters,
  setFilters,
}: IProps) => {
  const [allTags, setAllTags] = useState<{ slug: string; name: string }[]>([]);
  // const { data: stats } = useGetStats();
  const [{ data: homeData }] = useHomeQueryQuery();
  const statsData = homeData?.stats
    ? homeData.stats[showPageTypes ? "pages" : "posts"]
    : { published: 0, drafts: 0, trashed: 0 };
  const { data, fetching } = useGetTags();

  useEffect(() => {
    if (!showTags || showPageTypes) return onChange(filters);

    if (fetching || !data) return;

    const uniqueData = [
      ...data.reduce((map, obj) => map.set(obj.slug, obj), new Map()).values(),
    ];
    setAllTags(
      uniqueData.map((tag) => ({
        slug: tag.slug,
        name: tag.name,
      }))
    );
  }, [filters, fetching, onChange, showPageTypes, showTags, data]);

  const onBadgeClick = (status: PostStatusOptions) => {
    let newStatusFilters = [...(filters.status ?? []), status];
    if (filters.status?.includes(status)) {
      newStatusFilters = (filters.status ?? []).filter((s) => s !== status);
    }
    const changedFilters = { ...filters, status: newStatusFilters };
    setFilters(changedFilters);
    onChange({ ...changedFilters });
  };

  // if (fetching && showTags) return <Loading />;

  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex flex-row gap-2 text-sm">
        <ToggleGroup
          variant="outline"
          type="multiple"
          value={filters.status}
          disabled={fetching}
        >
          <ToggleGroupItem
            value={PostStatusOptions.Published}
            aria-label="Toggle bold"
            onClick={() => onBadgeClick(PostStatusOptions.Published)}
          >
            Published{" "}
            <span className="bg-slate-200 dark:bg-slate-700 rounded-full w-6 h-6 text-xs flex items-center justify-center ml-2">
              {statsData?.published ?? 0}
            </span>
          </ToggleGroupItem>
          <ToggleGroupItem
            value={PostStatusOptions.Draft}
            aria-label="Toggle Draft"
            onClick={() => onBadgeClick(PostStatusOptions.Draft)}
          >
            Drafts{" "}
            <span className="bg-slate-200 dark:bg-slate-700 rounded-full w-6 h-6 text-xs flex items-center justify-center ml-2">
              {statsData?.drafts ?? 0}
            </span>
          </ToggleGroupItem>
          <ToggleGroupItem
            value={PostStatusOptions.Trashed}
            aria-label="Toggle Trashed"
            onClick={() => onBadgeClick(PostStatusOptions.Trashed)}
          >
            Trashed{" "}
            <span className="bg-slate-200 dark:bg-slate-700 rounded-full w-6 h-6 text-xs flex items-center justify-center ml-2">
              {statsData?.trashed ?? 0}
            </span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="hidden grid-cols-2 items-center gap-2 md:grid ">
        <Select2
          defaultValue={SortBy.Desc}
          onValueChange={(value) => {
            track({
              eventAction: EventAction.Click,
              eventCategory: "filters",
              eventLabel: "sortBy",
            });
            setFilters({ ...filters, sortBy: value as SortBy });
            onChange({ ...filters, sortBy: value as SortBy });
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent id="filters-sort">
            <SelectItem value={SortBy.Desc}>Latest</SelectItem>
            <SelectItem value={SortBy.Asc}>Oldest</SelectItem>
          </SelectContent>
        </Select2>
        {allTags && showTags && (
          <Select2
            defaultValue={"all"}
            onValueChange={(value) => {
              if (value === "all") {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
              setFilters({ ...filters, tagSlug: value });
              onChange({ ...filters, tagSlug: value });
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent id="filters-sort">
              {[
                { key: "all", label: "All Tags" },
                ...allTags.map((tag) => ({
                  key: tag.slug,
                  label: tag.name,
                })),
              ].map(({ key, label }) => {
                return (
                  <SelectItem value={key} key={key}>
                    {label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select2>
        )}
        {showPageTypes && (
          <Select2
            defaultValue={filters.page_type ?? "all"}
            onValueChange={(value) => {
              if (value === "all") {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
                page_type: value as PageType,
                // type: PostTypes.Page,
              });
              onChange({ ...filters, page_type: value as PageType });
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent id="filters-sort">
              {[
                { key: "all", label: "All" },
                ...Object.keys(PageType).map((type) => ({
                  key: PageType[type],
                  label: type,
                })),
              ].map(({ key, label }) => {
                return (
                  <SelectItem value={key} key={key}>
                    {label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select2>
        )}
      </div>
    </div>
  );
};

export default Filters;
