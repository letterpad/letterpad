import { NavigationType } from "graphql-letterpad/dist/graphql";

export interface Collection {
  type: NavigationType.Page;
  slug: string;
  label: string;
  original_name: string;
  postCount: number;
}
