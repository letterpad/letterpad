import { NextApiRequest } from "next";
import { Author } from "@/__generated__/__types__";
import { Post } from "./__types__";

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

export type Session = Pick<
  Author,
  "id" | "email" | "role" | "permissions" | "avatar" | "username"
>;

export interface SessionData extends Session {
  __typename: "SessionData";
}

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

interface IImageAttrs {
  src: string;
  sizes: string;
  "data-srcset": string;
  srcSet: string[];
  width: string;
  loading: "lazy";
}
export type IImageAttrsResult = IImageAttrs | {};
