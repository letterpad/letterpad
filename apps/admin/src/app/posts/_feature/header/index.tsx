import className from "classnames";
import { PostStatusOptions, TagsNode } from "letterpad-graphql";
import { useEffect } from "react";
import { BiCog, BiTrash } from "react-icons/bi";
import tippy from "tippy.js";

import { getReadableDate, TOPIC_PREFIX } from "@/shared/utils";

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

const Actions = ({ changeStatus, id, status, onSettingsClick }) => {
  useEffect(() => {
    tippy("[data-tippy-content]");
  }, []);

  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSettingsClick(id);
        }}
        className="text-blue-600"
        data-tippy-content="Post Settings"
      >
        <BiCog size={20} />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          changeStatus(id, PostStatusOptions.Trashed);
        }}
        className="dark:text-red-800 text-red-500"
        data-tippy-content="Move to Trash"
      >
        <BiTrash size={20} />
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
        Set as Draft
      </button>
    </div>
  );
};
export const creativesColumns = ({ changeStatus, onSettingsClick }) => [
  { ...titleColumn },
  { ...statusColumn },
  { ...updatedAtColumn },
  {
    title: "Actions",
    dataIndex: "actions",
    key: "actions",
    render: (_, item) => (
      <Actions
        changeStatus={changeStatus}
        id={item.id}
        status={item.status}
        onSettingsClick={onSettingsClick}
      />
    ),
  },
];

export const postsColumns = ({ changeStatus, onSettingsClick }) => [
  { ...titleColumn },
  statusColumn,
  { ...updatedAtColumn },
  {
    title: "Topic",
    dataIndex: "tags",
    key: "tags",
    className: "hidden lg:table-cell max-w-sm",
    render: (tags: TagsNode) => {
      const topic = tags.rows
        .filter((tag) => tag.name.startsWith(TOPIC_PREFIX))
        .pop();
      if (!topic) return null;
      return (
        <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded flex items-center">
          {topic.name.replace(TOPIC_PREFIX, "")}
        </span>
      );
    },
  },
  {
    title: "Actions",
    dataIndex: "actions",
    key: "actions",
    render: (_, item) => (
      <Actions
        changeStatus={changeStatus}
        id={item.id}
        status={item.status}
        onSettingsClick={onSettingsClick}
      />
    ),
  },
];
