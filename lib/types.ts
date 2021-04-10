import { Author } from "./../__generated__/lib/type-defs.graphqls";
import { Post } from "./type-defs.graphqls";

export enum ROLES {
  ADMIN,
  REVIEWER,
  READER,
  AUTHOR,
}

export enum PERMISSIOMS {
  MANAGE_ALL_POSTS,
  MANAGE_OWN_POSTS,
  READ_ONLY_POSTS,
}

export enum PostTypes {
  post,
  page,
}

export type updatePostOptionalArgs = {
  cover_image?: string;
  cover_image_width?: number;
  cover_image_height?: number;
} & Omit<Post, "cover_image" | "cover_image_width" | "cover_image_height">;

export type SessionData = Pick<
  Author,
  "id" | "email" | "role" | "permissions" | "avatar"
>;
