import { Author, Post, Setting, Subscriber, Tag, Upload } from "@prisma/client";

export interface ITagSanitized {
  name: string;
  slug: string;
}

type SanitizedAuthor = Omit<
  Author,
  "id" | "password" | "role_id" | "verify_attempt_left"
>;
export interface IAuthorData extends SanitizedAuthor {
  setting: Omit<Setting, "id" | "author_id" | "client_token">;
  subscribers: Omit<Subscriber, "author_id" | "id" | "verify_attempt_left">[];
  uploads: Omit<Upload, "id" | "author_id">[];
  posts: (Omit<Post, "id" | "author_id"> & {
    tags: Omit<Tag, "id">[];
  })[];
}

export interface IImportExportData {
  authors: {
    [email: string]: IAuthorData;
  };
}
