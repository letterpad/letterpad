import { Post } from "@prisma/client";
import { MapResult } from "graphql-fields-list";

import { prisma } from "../../lib/prisma";

export function getMatchingFields(inputFields: MapResult) {
  const keys = Object.keys(inputFields) as (keyof Partial<Post>)[];
  return keys.filter((field) => prisma?.post.fields[field]);
}
