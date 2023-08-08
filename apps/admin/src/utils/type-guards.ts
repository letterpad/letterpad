import {
  Author,
  PostsNode,
  Setting,
  Stats,
} from "../../__generated__/__types__";

export function isPostsNode(data: any): data is PostsNode {
  return data?.__typename === "PostsNode";
}

export function isAuthor(data: any): data is Author {
  return data?.__typename === "Author";
}

export function isSettings(data: any): data is Setting {
  return data?.__typename === "Setting";
}

export function isStats(data: any): data is Stats {
  return data?.__typename === "Stats";
}
