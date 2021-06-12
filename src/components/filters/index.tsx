import { Select } from "antd";

import { PostStatusOptions, SortBy } from "@/__generated__/__types__";

interface IProps {
  onStatusChange?: (status: PostStatusOptions) => void;
  onOrderChange?: (order: SortBy) => void;
  onTagChange?: (slug: string) => void;
  allTags?: { name: string; slug: string }[];
}
const Option = Select.Option;

const Filters = ({
  onStatusChange,
  onOrderChange,
  onTagChange,
  allTags,
}: IProps) => {
  const hasStatusChange = typeof onStatusChange === "function";
  const hasOrderChange = typeof onOrderChange === "function";
  const hasTagChange = typeof onTagChange === "function";

  return (
    <>
      <>
        {hasStatusChange && (
          <Select
            style={{ width: 110 }}
            onChange={onStatusChange}
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
        )}
        {hasOrderChange && (
          <Select
            style={{ width: 100 }}
            onChange={onOrderChange}
            placeholder="Order by"
            allowClear
            size="middle"
          >
            {Object.keys(SortBy).map((key) => {
              return (
                <Option key={key} value={SortBy[key]}>
                  {key}
                </Option>
              );
            })}
          </Select>
        )}
        {hasTagChange && allTags && (
          <Select
            style={{ width: 120 }}
            onChange={onTagChange}
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
