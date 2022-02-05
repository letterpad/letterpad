import { Author, Post, Setting, Subscriber, Tag, Upload } from "@prisma/client";

// since these data will be exported and imported, it is easy to manupulate the data.
// We need types without id, author_id to avoid this.

export interface ITagSanitized {
  name: string;
  slug: string;
}

export interface IAuthorData extends Author {
  setting: Setting | null;
  subscribers: Subscriber[];
  uploads: Upload[];
  posts: (Post & {
    tags: Tag[];
  })[];
}

export interface IImportExportData {
  authors: {
    [email: string]: IAuthorData;
  };
}
