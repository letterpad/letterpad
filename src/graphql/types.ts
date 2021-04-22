import { NextApiRequest } from "next";
import { Author } from "../../__generated__/src/graphql/type-defs.graphqls";
import { Post } from "./type-defs.graphqls";

export enum ROLES {
  ADMIN = "ADMIN",
  REVIEWER = "REVIEWER",
  READER = "READER",
  AUTHOR = "AUTHOR",
}

export enum PERMISSIOMS {
  MANAGE_ALL_POSTS = "MANAGE_ALL_POSTS",
  MANAGE_OWN_POSTS = "MANAGE_OWN_POSTS",
  READ_ONLY_POSTS = "READ_ONLY_POSTS",
}

export enum PostTypes {
  post,
  page,
}

export type updatePostOptionalArgs = {
  cover_image: string;
  cover_image_width: number;
  cover_image_height: number;
} & Omit<Post, "cover_image" | "cover_image_width" | "cover_image_height">;

export type SessionData = {
  user: Pick<Author, "id" | "email" | "role" | "permissions" | "avatar">;
};
export interface IMediaUploadResult {
  src: string;
  error: string | null;
  name: string;
  size: {
    width: number;
    height: number;
    type: string;
  };
}

export type NextApiRequestWithFormData = NextApiRequest & {
  files: BlobCorrected[];
};

export type BlobCorrected = Blob & {
  buffer: Buffer;
  originalname: string;
  hash: string;
};
