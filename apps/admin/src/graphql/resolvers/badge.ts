import { Resolvers } from "letterpad-graphql";

const badgeResolvers: Resolvers = {
  Query: {
    getAuthorBadges: async (_, { authorId }, { prisma }) => {
      try {
        const badges = await prisma.badge.findMany({
          where: {
            author_id: authorId,
          },
        });
        return badges;
      } catch (error) {
        console.error("Failed to fetch badges for author", error);
        throw new Error("Failed to fetch badges");
      }
    },
  },
};

export default badgeResolvers;
