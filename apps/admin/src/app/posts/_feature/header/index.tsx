import className from "classnames";

import { PostStatusOptions, TagsNode } from "@/__generated__/__types__";

import { getReadableDate } from "../../../../shared/utils";

const titleColumn = {
  title: "Title",
  dataIndex: "title",
  key: "title",
  className: "max-w-md text-ellipsis",
  render: (title: string) => <span>{title || "(Draft)"}</span>,
};

const statusColumn = {
  title: "Status",
  dataIndex: "status",
  key: "status",
  render: (status: PostStatusOptions) => (
    <span className={`post-status post-status-${status}`} />
  ),
};
const updatedAtColumn = {
  title: "Updated",
  dataIndex: "updatedAt",
  key: "updatedAt",
  className: "hidden lg:table-cell",
  render: (date: string) => {
    return <span>{getReadableDate(date)}</span>;
  },
};

const Actions = ({ changeStatus, id, status }) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          changeStatus(id, PostStatusOptions.Trashed);
        }}
        className="text-blue-600"
      >
        Delete
      </button>
      <span
        className={className({
          hidden: status !== PostStatusOptions.Trashed,
        })}
      >
        |
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          changeStatus(id, PostStatusOptions.Draft);
        }}
        className={className("text-blue-600", {
          hidden: status !== PostStatusOptions.Trashed,
        })}
      >
        Draft
      </button>
    </div>
  );
};
export const creativesColumns = ({ changeStatus }) => [
  { ...titleColumn },
  { ...statusColumn },
  { ...updatedAtColumn },
  {
    title: "Actions",
    dataIndex: "actions",
    key: "actions",
    render: (_, item) => (
      <Actions changeStatus={changeStatus} id={item.id} status={item.status} />
    ),
  },
];

export const postsColumns = ({ changeStatus }) => [
  { ...titleColumn },
  statusColumn,
  { ...updatedAtColumn },
  {
    title: "Tags",
    dataIndex: "tags",
    key: "tags",
    className: "hidden lg:table-cell max-w-sm",
    render: (tags: TagsNode) => {
      return <span>{tags.rows.map((tag) => tag.name).join(", ")}</span>;
    },
  },
  {
    title: "Actions",
    dataIndex: "actions",
    key: "actions",
    render: (_, item) => (
      <Actions changeStatus={changeStatus} id={item.id} status={item.status} />
    ),
  },
];
