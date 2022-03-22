import { Select } from "antd";

import {
  PostsFilters,
  PostStatusOptions,
  SortBy,
} from "@/__generated__/__types__";
import { useEffect, useState } from "react";
import { useTagsContext } from "../tags/context";
import Loading from "../loading";
import { EventAction, track } from "@/track";

interface IProps {
  showTags?: boolean;
  onChange: (filters: PostsFilters) => void;
}
const Option = Select.Option;

const Filters = ({ showTags = true, onChange }: IProps) => {
  const [allTags, setAllTags] = useState<{ slug: string; name: string }[]>([]);
  const [filters, setFilters] = useState<PostsFilters>({
    sortBy: SortBy["Desc"],
  });
  const { tags, loading } = useTagsContext();

  useEffect(() => {
    if (!showTags) return;
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
  }, [JSON.stringify(filters), tags]);

  if (loading && showTags) return <Loading />;
  return (
    <>
      <Select
        style={{ width: 105 }}
        onChange={(status: PostStatusOptions) => {
          track({
            eventAction: EventAction.Click,
            eventCategory: "filters",
            eventLabel: "status",
          });
          setFilters({ ...filters, status });
        }}
        placeholder="Status"
        allowClear
        size="middle"
      >
        {Object.keys(PostStatusOptions).map((key) => {
          return (
            <Option key={key} value={PostStatusOptions[key]}>
              {key}
            </Option>
          );
        })}
      </Select>
      &nbsp;
      <Select
        style={{ width: 100 }}
        onChange={(sortBy: SortBy) => {
          track({
            eventAction: EventAction.Click,
            eventCategory: "filters",
            eventLabel: "sortBy",
          });
          setFilters({ ...filters, sortBy });
        }}
        placeholder="Order by"
        allowClear
        size="middle"
        value={filters.sortBy}
      >
        {Object.keys(SortBy).map((key) => {
          return (
            <Option key={key} value={SortBy[key]}>
              {key}
            </Option>
          );
        })}
      </Select>
      &nbsp;
      {allTags && showTags && (
        <Select
          style={{ width: 118 }}
          onChange={(tagSlug: string) => {
            track({
              eventAction: EventAction.Click,
              eventCategory: "filters",
              eventLabel: "tagSlug",
            });
            setFilters({ ...filters, tagSlug });
          }}
          placeholder="By Tag"
          allowClear
          size="middle"
        >
          {allTags.map((tag) => {
            return (
              <Option key={tag.name} value={tag.slug}>
                {tag.name}
              </Option>
            );
          })}
        </Select>
      )}
      <br />
      <br />
    </>
  );
};

export default Filters;
