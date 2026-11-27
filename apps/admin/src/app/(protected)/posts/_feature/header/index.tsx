import {
  AdminPostsFragmentFragment,
  PostStatusOptions,
} from "letterpad-graphql";
import Link from "next/link";
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
} from "ui/dist/index.mjs";

import { getReadableDate, TOPIC_PREFIX } from "@/shared/utils";

interface ColumnOptions {
  changeStatus: (id: string, status: PostStatusOptions) => void;
  onSettingsClick: (id: string) => void;
  displayTags: boolean;
}

const Status = ({ status }: { status: PostStatusOptions }) => (
  <span className="workspace-post-status capitalize" data-status={status}>
    {status}
  </span>
);

const getTopic = (tags: AdminPostsFragmentFragment["tags"]) => {
  if (!tags || !("rows" in tags)) return undefined;
  const topic = tags.rows.find((tag) => tag.name.startsWith(TOPIC_PREFIX));
  return topic?.name.slice(TOPIC_PREFIX.length);
};

export const columns = ({
  changeStatus,
  onSettingsClick,
  displayTags,
}: ColumnOptions): ColumnDef<AdminPostsFragmentFragment>[] => [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row: { original: post } }) => {
      const topic = displayTags ? getTopic(post.tags) : undefined;
      return (
        <>
          <Link
            className="workspace-post-title"
            href={`/post/${post.id}`}
            prefetch={false}
          >
            {post.title || "Untitled"}
          </Link>
          {post.excerpt && (
            <p className="workspace-post-excerpt workspace-post-meta">
              {post.excerpt}
            </p>
          )}
          <div className="workspace-post-mobile-meta workspace-post-meta">
            <Status status={post.status} />
            {topic && <span>{topic}</span>}
            {post.updatedAt && (
              <time dateTime={post.updatedAt}>
                {getReadableDate(post.updatedAt)}
              </time>
            )}
          </div>
        </>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        size="small"
        className="workspace-sort-heading"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <LuArrowUpDown aria-hidden="true" className="h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => <Status status={row.original.status} />,
  },
  {
    accessorKey: "tags",
    header: () => (displayTags ? "Topic" : null),
    cell: ({ row }) => {
      if (!displayTags) return null;
      return (
        <span className="workspace-post-meta">
          {getTopic(row.original.tags) ?? "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <Button
        size="small"
        className="workspace-sort-heading"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Updated
        <LuArrowUpDown aria-hidden="true" className="h-3 w-3" />
      </Button>
    ),
    cell: ({ row: { original: post } }) =>
      post.updatedAt && (
        <time className="workspace-post-meta" dateTime={post.updatedAt}>
          {getReadableDate(post.updatedAt)}
        </time>
      ),
  },
  {
    id: "actions",
    cell: ({ row: { original: post } }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="workspace-icon-button"
            aria-label={`Actions for ${post.title || "untitled post"}`}
          >
            <FiMoreHorizontal aria-hidden="true" />
          </button>
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
    ),
  },
];
