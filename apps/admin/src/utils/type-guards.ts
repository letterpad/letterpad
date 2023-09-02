import {
  DefinitionNode,
  DocumentNode,
  ExecutableDefinitionNode,
  Kind,
  OperationDefinitionNode,
} from "graphql";
import { Operation } from "urql";

import {
  Author,
  Post,
  PostsNode,
  Setting,
  Stats,
  TagsNode,
} from "../../__generated__/__types__";

export function isPostsNode(data: any): data is PostsNode {
  return data?.__typename === "PostsNode";
}
export function isPost(data: any): data is Post {
  return data?.__typename === "Post";
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
export function isTagsNode(data: any): data is TagsNode {
  return data?.__typename === "TagsNode";
}

export function isOperationDefinition(
  doc: any
): doc is OperationDefinitionNode {
  if (
    doc.definitions &&
    doc.definitions[0] &&
    doc.definitions[0].kind === Kind.OPERATION_DEFINITION
  ) {
    return true;
  }
  return false;
}
