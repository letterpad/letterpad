import { PostsFilters, PostStatusOptions, SortBy } from "letterpad-graphql";
import { useHomeQueryQuery } from "letterpad-graphql/hooks";
import { useEffect, useState } from "react";
import { CiFilter } from "react-icons/ci";
import {
  Button,
  DropdownMenuCheckboxes,
  Select2,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "ui/dist/index.mjs";

import { useGetTags } from "@/app/(protected)/tags/_feature/api.client";
import { PageType } from "@/graphql/types";
import { EventAction, EventCategory, EventLabel, track } from "@/track";

interface IProps {
  showTags?: boolean;
  onChange: (filters: PostsFilters) => void;
  showPageTypes?: boolean;
  filters: PostsFilters;
  setFilters: (data: PostsFilters) => void;
  showSort?: boolean;
}

export const Filters = ({
  showTags = true,
  onChange,
  showPageTypes = false,
  showSort = true,
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
    if (!showTags || showPageTypes) return;

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

  // if (fetching && showTags) return null;

  return (
    <div className="flex flex-row items-center justify-between gap-2">
      <div className="flex-row items-center gap-2 md:flex hidden">
        {showSort && (
          <Select2
            defaultValue={SortBy.Desc}
            onValueChange={(value) => {
              track({
                eventAction: EventAction.Click,
                eventCategory: EventCategory.Filters,
                eventLabel: EventLabel.SortBy,
              });
              setFilters({ ...filters, sortBy: value as SortBy });
              onChange({ ...filters, sortBy: value as SortBy });
            }}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent id="filters-sort">
              <SelectItem value={SortBy.Desc}>Latest</SelectItem>
              <SelectItem value={SortBy.Asc}>Oldest</SelectItem>
            </SelectContent>
          </Select2>
        )}
        {allTags.length > 0 && showTags && (
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
                eventCategory: EventCategory.Filters,
                eventLabel: EventLabel.Tags,
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
                eventCategory: EventCategory.Filters,
                eventLabel: value as PageType,
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
      <div className="flex flex-row gap-2 text-sm">
        <DropdownMenuCheckboxes
          data={[
            {
              checked:
                filters.status?.includes(PostStatusOptions.Published) ?? false,
              label: `Published (${statsData?.published ?? 0})`,
              onCheckedChange: () => {
                onBadgeClick(PostStatusOptions.Published);
              },
            },
            {
              checked:
                filters.status?.includes(PostStatusOptions.Draft) ?? false,
              label: `Drafts (${statsData?.drafts ?? 0})`,
              onCheckedChange: () => {
                onBadgeClick(PostStatusOptions.Draft);
              },
            },
            {
              checked:
                filters.status?.includes(PostStatusOptions.Trashed) ?? false,
              label: `Trashed (${statsData?.trashed ?? 0})`,
              onCheckedChange: () => {
                onBadgeClick(PostStatusOptions.Trashed);
              },
            },
          ]}
          trigger={
            <Button size={"small"} className="!p-1 w-8 !h-8">
              <CiFilter />
            </Button>
          }
        />
      </div>
    </div>
  );
};

export default Filters;
