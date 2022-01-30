import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
  ],
});
// prisma.$on("query", async (e) => {
//   console.log("");
//   console.log("");
//   console.log("");
//   console.log("");
//   console.log(`${e.query} ${e.params}`);
// });
export type PrismaType = typeof prisma;

async function main() {
  const oldName = "first-post";
  const newName = "second-post";

  const linkedPosts = await prisma.post.findMany({
    select: {
      id: true,
    },
    where: {
      tags: {
        some: {
          name: oldName,
        },
      },
    },
  });

  for (let i = 0; i < linkedPosts.length; i++) {
    const { id } = linkedPosts[i];
    await prisma.post.update({
      data: {
        tags: {
          disconnect: {
            name: oldName,
          },
          connectOrCreate: {
            create: {
              name: newName,
              slug: newName,
            },
            where: {
              name: newName,
            },
          },
        },
      },
      where: {
        id,
      },
    });
  }

  return true;
}

// main();
