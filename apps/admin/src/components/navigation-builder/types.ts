import { NavigationType } from "@/__generated__/__types__";

export interface Collection {
  type: NavigationType.Page;
  slug: string;
  label: string;
  original_name: string;
  postCount: number;
}
