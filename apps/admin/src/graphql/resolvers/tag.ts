import { fieldsMap } from "graphql-fields-list";
import {
  MutationResolvers,
  QueryResolvers,
  Tag as ITag,
  TagResolvers,
  TagType,
} from "letterpad-graphql";

import { ResolverContext } from "@/graphql/context";
import { createPathWithPrefix } from "@/utils/slug";

import {
  deleteTags,
  getPostsFromTag,
  getTag,
  getTags,
  updateTags,
} from "../services/tag";
import { beautifyTopic, TOPIC_PREFIX } from "../../shared/utils";
import { isPostgresDb } from "../../utils/utils";

const Query: QueryResolvers<ResolverContext> = {
  async tag(_root, args, context) {
    return getTag(args, context);
  },
  async tags(_root, args, context) {
    return getTags(args, context);
  },
  async popularTags(_root, args, { prisma }) {
    // Postgress needs double quotes for table names or else it will convert tables to lowercase
    const tags: ITag[] = !isPostgresDb()
      ? await prisma.$queryRaw`
        SELECT count(*) as c, T.name, T.slug  
          FROM _PostToTag
          INNER JOIN Tag T ON B = T.name 
          INNER JOIN Post P ON A = P.id 
          WHERE T.name LIKE CONCAT(${TOPIC_PREFIX}, '%') 
            AND P.title != 'Coming Soon' 
            AND P.title != '' 
            AND P.excerpt != '' 
            AND P.status = 'published' 
            AND P.type = 'post'
          GROUP BY T.name 
          HAVING count(*) > 2 
          ORDER BY c DESC;
      `
      : await prisma.$queryRaw`
        SELECT count(*) as c, T.name, T.slug  
          FROM "_PostToTag"
          INNER JOIN "Tag" T ON "B" = T.name 
          INNER JOIN "Post" P ON "A" = P.id 
          WHERE T.name LIKE CONCAT(${TOPIC_PREFIX}, '%') 
            AND P.title != 'Coming Soon' 
            AND P.title != '' 
            AND P.excerpt != '' 
            AND P.status = 'published' 
            AND P.type = 'post'
          GROUP BY T.name 
          HAVING count(*) > 2 
          ORDER BY c DESC;
      `;

    return {
      ok: true,
      rows: tags.map((tag) => ({
        name: beautifyTopic(tag.name),
        slug: tag.name,
        count: parseInt(tag.count?.toString() ?? "0"),
        id: tag.name,
        type: TagType.Tag,
      })),
    };
  },
};

const Tag: TagResolvers<ResolverContext> = {
  async slug({ slug }) {
    return createPathWithPrefix(slug, "tag");
  },
  async posts({ id }, _args, context, info) {
    const fields = fieldsMap(info);
    return getPostsFromTag(id, context, fields);
  },
};

const Mutation: MutationResolvers<ResolverContext> = {
  async updateTags(_root, args, context) {
    return updateTags(args, context);
  },

  async deleteTags(_root, args, context) {
    return deleteTags(args, context);
  },
};
export default { Query, Tag, Mutation };
