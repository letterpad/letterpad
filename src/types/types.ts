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
