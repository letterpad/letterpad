import { NavigationType } from "letterpad-graphql";

export interface Collection {
  type: NavigationType.Page;
  slug: string;
  label: string;
  original_name: string;
  postCount: number;
}
