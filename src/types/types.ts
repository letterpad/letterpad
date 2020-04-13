import { Author, EnumPermissions, EnumRoles } from "../__generated__/gqlTypes";
import { Image, Navigation, Setting } from "./../__generated__/gqlTypes";

import { RouteComponentProps } from "react-router-dom";

export interface IAdminLayoutProps {
  exact: true;
  settings: Setting;
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

export type UpdateSettingOption =
  | { site_title: string }
  | { site_tagline: string }
  | { site_email: string }
  | { site_url: string }
  | { site_footer: string }
  | { site_description: string }
  | { subscribe_embed: string }
  | { social_twitter: string }
  | { social_facebook: string }
  | { social_instagram: string }
  | { social_github: string }
  | { displayAuthorInfo: string }
  | { cloudinary_key: string }
  | { cloudinary_name: string }
  | { cloudinary_secret: string }
  | { css: string }
  | { google_analytics: string }
  | { locale: string }
  | { theme: string }
  | { disqus_id?: string }
  | { banner: Image }
  | { site_logo: Image }
  | { site_favicon: Image }
  | { menu: Navigation[] };
