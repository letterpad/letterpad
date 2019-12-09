export enum IFileUploadTypes {
  featured_image = "featured_image",
  post_image = "post_image",
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
