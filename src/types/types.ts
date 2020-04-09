import { Author, EnumPermissions, EnumRoles } from "../__generated__/gqlTypes";

import { RouteComponentProps } from "react-router-dom";
import { TypeSettings } from "../client/types";

export interface IAdminLayoutProps {
  exact: true;
  settings: TypeSettings;
  type: "post_tag";
  path: "/admin/tags";
  layout: "none" | "b";
  author: Required<Pick<Author, "id" | "role" | "email">> & {
    permissions: EnumPermissions[];
    name: string;
    expiresIn: string;
    iat: number;
    exp: number;
  };
}

export interface IAdminRouteProps extends IAdminLayoutProps {
  router: RouteComponentProps;
}

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
  folder_name: string;
  settings?: boolean;
  active?: boolean;
  author: string;
  description: string;
}

export interface IAuthor {
  id: number;
  avatar: string;
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

export interface IAdminMenu {
  id: number;
  name: string;
  priority: number;
  permissions: EnumPermissions[];
  slug: string;
  icon: string;
  children?: IAdminMenu[];
}
