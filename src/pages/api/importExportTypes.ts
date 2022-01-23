import { Author } from "@/graphql/db/models/definations_old/author";
import { Upload } from "@/graphql/db/models/definations_old/uploads";
import { Post } from "@/graphql/db/models/definations_old/post";
import { Setting } from "@/graphql/db/models/definations_old/setting";
import { Tag } from "@/graphql/db/models/definations_old/tag";

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
  tags: Omit<Tag, "id" | "author_id">[];
  media: Omit<Upload, "id">[];
  author: Omit<Author, "id" | "role_id" | "setting_id">;
}

export interface IImportExportData {
  authors: {
    [email: string]: IAuthorData;
  };
}
