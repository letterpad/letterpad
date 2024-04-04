import classNames from "classnames";
import { Post, PostStatusOptions } from "letterpad-graphql";
import { FiMoreHorizontal } from "react-icons/fi";
import { LuArrowUpDown } from "react-icons/lu";
import {
  Button,
  ColumnDef,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "ui";

import { getReadableDate, TOPIC_PREFIX } from "@/shared/utils";

export const columns = ({
  changeStatus,
  onSettingsClick,
  onClick,
  displayTags,
}): ColumnDef<Post>[] => [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const post = row.original;
      const tags = post.tags;
      const topic = tags?.["rows"]?.find((tag) =>
        tag.name.startsWith(TOPIC_PREFIX)
      );

      return (
        <div
          className="ml-5 font-medium font-heading space-y-4 py-2 md:py-0"
          onClick={() => onClick(row.original.id)}
        >
          <li className="flex md:hidden items-center gap-2 mb-2">
            <span
              className={classNames(
                "uppercase text-[0.6rem] inline-flex items-center rounded-[0.3rem]  transition-colors focus:outline-none w-2 h-2 focus:ring-2 focus:ring-ring focus:ring-offset-2",
                {
                  "bg-green-600": post.status === "published",
                  "bg-red-600": post.status === "trashed",
                  "bg-orange-500": post.status === "draft",
                }
              )}
            ></span>
            <span className="opacity-60">
              {getReadableDate(row.getValue("updatedAt"))}
            </span>
          </li>
          <span className="dark:text-white">{row.getValue("title")}</span>
          <ul className="flex gap-3 md:hidden flex-row">
            {topic?.name && (
              <li className="flex items-center gap-1">
                In
                <span className="text-blue-500 font-heading">
                  {topic?.name.replace(TOPIC_PREFIX, "")}
                </span>
              </li>
            )}
          </ul>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => {
      return <span className="md:block hidden">Status</span>;
    },
    cell: ({ row }) => {
      const post = row.original;
      return (
        <div className="ml-5 hidden md:block">
          <span
            className={classNames(
              "uppercase text-[0.6rem] inline-flex items-center rounded-[0.3rem]  transition-colors focus:outline-none w-2 h-2 focus:ring-2 focus:ring-ring focus:ring-offset-2",
              {
                "bg-green-600": post.status === "published",
                "bg-red-600": post.status === "trashed",
                "bg-orange-500": post.status === "draft",
              }
            )}
          ></span>
        </div>
      );
    },
  },
  {
    accessorKey: "tags",
    header: ({ column }) => {
      if (!displayTags) return null;
      return (
        <Button
          className="hidden md:flex"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Topic
          <LuArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      if (!displayTags) return null;
      const tags = row.getValue("tags");
      const topic = tags?.["rows"]?.find((tag) =>
        tag.name.startsWith(TOPIC_PREFIX)
      );
      if (!topic) return null;
      return (
        <div className="hidden md:inline-flex ml-5 text-blue-500 items-center">
          {topic.name.replace(TOPIC_PREFIX, "")}
        </div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="hidden md:flex"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Updated At
          <LuArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="ml-5 hidden md:block">
          {getReadableDate(row.getValue("updatedAt"))}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const post = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="h-8 w-8 p-0 flex items-center justify-center">
              <span className="sr-only">Open menu</span>
              <FiMoreHorizontal size={20} />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onSettingsClick(post.id)}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => changeStatus(post.id, PostStatusOptions.Trashed)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
