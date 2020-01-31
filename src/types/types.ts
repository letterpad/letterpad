import { EnumPermissions, EnumRoles } from "../__generated__/gqlTypes";

export enum IFileUploadTypes {
  featured_image = "featured_image",
  post_image = "post_image",
}
export interface ITokenData {
  email: string;
  id: number;
  role: EnumRoles;
  permissions: [EnumPermissions];
  name: string;
  expiresIn: Date;
  iat?: number;
  exp?: number;
}

export interface IThemeConfig {
  name: string;
  thumbnail: string;
  short_name: string;
  settings?: boolean;
  active?: boolean;
  author: string;
  description: string;
}

export interface IAuthor {
  id: number;
  avatar: string;
}

export interface IFrameAttributes {
  width: string;
  height: string;
  frameBorder: string;
}

export type EmbedContentCallBack = (
  instance: HTMLIFrameElement,
  attrs: IFrameAttributes,
  content?: string,
) => void;

export interface IEmbedProvider {
  url?: string;
  getContent: EmbedContentCallBack;
  matches: string[];
}

export interface IEmbedParent {
  url?: string;
  attributes?: any;
  getContent: EmbedContentCallBack;
  node: { data: { get: (attr: string) => any } };
  isSelected?: boolean;
  children?: React.ReactChildren;
}
