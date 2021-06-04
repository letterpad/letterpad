export interface IGhostDb {
  data: {
    posts: IGhostPosts[];
    users: IGhostUsers[];
    settings: IGhostSettings[];
    tags: IGhostTags[];
    posts_tags: IGhostPostTags[];
  };
}
export interface IImportExportGhostData {
  db: IGhostDb[];
}

interface IGhostPosts {
  id: number;
  uuid: string;
  title: string;
  slug: string;
  markdown: string;
  html: string;
  image: string;
  featured: number;
  page: number;
  status: "published" | "draft";
  meta_title: string;
  meta_description: string;
  created_at: Date;
  updated_at: Date;
  published_at: Date;
}

interface IGhostUsers {
  id: number;
  uuid: string;
  name: string;
  email: string;
  image: string;
  bio: string;
  website: string;
  meta_title: string;
  meta_description: string;
  created_at: Date;
  updated_at: Date;
}

interface IGhostTags {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  meta_title: string;
  meta_description: string;
  created_at: Date;
  updated_at: Date;
}

interface IGhostPostTags {
  id: number;
  post_id: number;
  tag_id: number;
}

export interface IGhostSettings {
  id: number;
  uuid: string;
  key: "title" | "description" | "email" | "logo" | "cover";
  value: string;
}
