import { Post } from "./type-defs.graphqls";

export enum ROLES {
  ADMIN,
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
