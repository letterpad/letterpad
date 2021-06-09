import { Select, Space } from "antd";

import {
  PostStatusOptions,
  SortBy,
} from "@/__generated__/queries/queries.graphql";

interface IProps {
  onStatusChange?: (status: PostStatusOptions) => void;
  onOrderChange?: (order: SortBy) => void;
}
const Option = Select.Option;

const Filters = ({ onStatusChange, onOrderChange }: IProps) => {
  const hasStatusChange = typeof onStatusChange === "function";
  const hasOrderChange = typeof onOrderChange === "function";

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
            {Object.keys(PostStatusOptions).map(key => {
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
            {Object.keys(SortBy).map(key => {
              return (
                <Option key={key} value={SortBy[key]}>
                  {key}
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
