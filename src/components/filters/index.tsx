import { Select } from "antd";

import {
  PostsFilters,
  PostStatusOptions,
  SortBy,
} from "@/__generated__/__types__";
import { useEffect, useState } from "react";
import { fetchTags } from "../tags/api";

interface IProps {
  showTags?: boolean;
  onChange: any;
}
const Option = Select.Option;

const Filters = ({ showTags = true, onChange }: IProps) => {
  const [allTags, setAllTags] = useState<{ slug: string; name: string }[]>([]);
  const [filters, setFilters] = useState<PostsFilters>({});

  useEffect(() => {
    if (!showTags) return;
    fetchTags().then((response) => {
      if (!response.props.error) {
        const uniqueData = [
          ...response.props.data
            .reduce((map, obj) => map.set(obj.slug, obj), new Map())
            .values(),
        ];
        setAllTags(
          uniqueData.map((tag) => ({
            slug: tag.slug,
            name: tag.name,
          })),
        );
      }
    });
    onChange(filters);
  }, [JSON.stringify(filters)]);

  return (
    <>
      <>
        <Select
          style={{ width: 105 }}
          onChange={(status: PostStatusOptions) => {
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
          onChange={(sortBy: SortBy) => setFilters({ ...filters, sortBy })}
          placeholder="Order by"
          allowClear
          size="middle"
          value={SortBy["Desc"]}
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
            onChange={(tagSlug: string) => setFilters({ ...filters, tagSlug })}
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
      </>
      <br />
      <br />
    </>
  );
};

export default Filters;
