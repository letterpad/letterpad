import { AuthorAttributes } from "@/graphql/db/models/author";
import { MediaAttributes } from "@/graphql/db/models/media";
import { PermissionAttributes } from "@/graphql/db/models/permission";
import { PostAttributes } from "@/graphql/db/models/post";
import { RoleAttributes } from "@/graphql/db/models/role";
import { SettingAttributes } from "@/graphql/db/models/setting";
import { TagsAttributes } from "@/graphql/db/models/tags";

// since these data will be exported and imported, it is easy to manupulate the data.
// We need types without id, author_id to avoid this.

interface ITagSanitized {
  name: string;
  desc: string;
  slug: string;
}
interface IPostSanitized
  extends Omit<PostAttributes, "id" | "author_id" | "tags"> {
  tags: ITagSanitized[];
}

interface RolePermissions {
  created_at: Date;
  updated_at: Date;
  role_id: number;
  permission_id: number;
}

export interface IAuthorData {
  posts: IPostSanitized[];
  setting: Omit<SettingAttributes, "id">;
  tags: Omit<TagsAttributes, "id" | "author_id">[];
  media: Omit<MediaAttributes, "id">[];
  author: Omit<AuthorAttributes, "id" | "role_id" | "setting_id">;
}

export interface IImportExportData {
  common: {
    roles: RoleAttributes[];
    permissions: PermissionAttributes[];
    rolePermissions: RolePermissions[];
  };
  authors: {
    [email: string]: IAuthorData;
  };
}
