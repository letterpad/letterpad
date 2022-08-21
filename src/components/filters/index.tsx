import { useEffect, useState } from "react";

import {
  PostsFilters,
  PostStatusOptions,
  SortBy,
} from "@/__generated__/__types__";
import { EventAction, track } from "@/track";

import Loading from "../loading";
import { useTagsContext } from "../tags/context";

interface IProps {
  showTags?: boolean;
  onChange: (filters: PostsFilters) => void;
}

const Filters = ({ showTags = true, onChange }: IProps) => {
  const [allTags, setAllTags] = useState<{ slug: string; name: string }[]>([]);
  const [filters, setFilters] = useState<PostsFilters>({
    sortBy: SortBy["Desc"],
  });
  const { tags, loading } = useTagsContext();

  useEffect(() => {
    if (!showTags) return onChange(filters);
    if (loading || !tags) return;

    const uniqueData = [
      ...tags.reduce((map, obj) => map.set(obj.slug, obj), new Map()).values(),
    ];
    setAllTags(
      uniqueData.map((tag) => ({
        slug: tag.slug,
        name: tag.name,
      })),
    );

    onChange(filters);
  }, [filters, loading, onChange, showTags, tags]);

  if (loading && showTags) return <Loading />;
  return (
    <>
      <select
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          if (e.target.value === "all") {
            const { status, ...rest } = filters;
            return setFilters({
              ...rest,
            });
          }
          track({
            eventAction: EventAction.Click,
            eventCategory: "filters",
            eventLabel: "status",
          });
          setFilters({
            ...filters,
            status: e.target.value as PostStatusOptions,
          });
        }}
      >
        <option value="all">All</option>
        {Object.keys(PostStatusOptions).map((key) => {
          return (
            <option key={key} value={PostStatusOptions[key]}>
              {key}
            </option>
          );
        })}
      </select>
      &nbsp;
      <select
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          track({
            eventAction: EventAction.Click,
            eventCategory: "filters",
            eventLabel: "sortBy",
          });
          setFilters({ ...filters, sortBy: e.target.value as SortBy });
        }}
      >
        {Object.keys(SortBy).map((key) => {
          return (
            <option key={key} value={SortBy[key]}>
              {key}
            </option>
          );
        })}
      </select>
      &nbsp;
      {allTags && showTags && (
        <select
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            if (e.target.value === "all") {
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
            setFilters({ ...filters, tagSlug: e.target.value });
          }}
        >
          <option value="all">All</option>
          {allTags.map((tag) => {
            return (
              <option key={tag.name} value={tag.slug}>
                {tag.name}
              </option>
            );
          })}
        </select>
      )}
      <br />
      <br />
    </>
  );
};

export default Filters;
