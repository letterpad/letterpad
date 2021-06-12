import { AuthorAttributes } from "@/graphql/db/models/author";
import { MediaAttributes } from "@/graphql/db/models/media";
import { PostAttributes } from "@/graphql/db/models/post";
import { SettingAttributes } from "@/graphql/db/models/setting";
import { TagsAttributes } from "@/graphql/db/models/tags";

// since these data will be exported and imported, it is easy to manupulate the data.
// We need types without id, author_id to avoid this.

export interface ITagSanitized {
  name: string;
  desc?: string;
  slug: string;
}
interface IPostSanitized
  extends Omit<PostAttributes, "id" | "author_id" | "tags"> {
  tags: ITagSanitized[];
}

export interface IAuthorData {
  posts: IPostSanitized[];
  setting: Omit<SettingAttributes, "id">;
  tags: Omit<TagsAttributes, "id" | "author_id">[];
  media: Omit<MediaAttributes, "id">[];
  author: Omit<AuthorAttributes, "id" | "role_id" | "setting_id">;
}

export interface IImportExportData {
  authors: {
    [email: string]: IAuthorData;
  };
}
