export interface IThemeConfig {
  name: string;
  thumbnail: string;
  short_name: string;
  settings?: boolean;
  active?: boolean;
}

export interface IAuthor {
  id: number;
  avatar: string;
}
