import { Prisma } from "@prisma/client";
import { PostStatusOptions, PostTypes } from "letterpad-graphql";

/** Posts that are eligible to appear in Letterpad's public discovery feeds. */
export const discoveryEligibilityWhere: Prisma.PostWhereInput = {
  status: PostStatusOptions.Published,
  type: PostTypes.Post,
  banned: false,
  exclude_from_home: false,
  excerpt: { not: { equals: "" } },
  html: { not: { equals: "" } },
  NOT: [{ title: { equals: "" } }, { title: { equals: "Coming Soon" } }],
};
