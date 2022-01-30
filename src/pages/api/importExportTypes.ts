import { Author, Post, Setting, Tag, Upload } from "@prisma/client";

// since these data will be exported and imported, it is easy to manupulate the data.
// We need types without id, author_id to avoid this.

export interface ITagSanitized {
  name: string;
  desc?: string;
  slug: string;
}
interface IPostSanitized extends Omit<Post, "id" | "author_id" | "tags"> {
  tags: ITagSanitized[];
}

export interface IAuthorData {
  posts: IPostSanitized[];
  setting: Omit<Setting, "id">;
  tags: Tag[];
  media: Omit<Upload, "id">[];
  author: Omit<Author, "id" | "role_id" | "setting_id">;
}

export interface IImportExportData {
  authors: {
    [email: string]: IAuthorData;
  };
}
