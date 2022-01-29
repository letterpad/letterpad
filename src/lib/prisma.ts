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

// async function main() {
//   const a = await prisma.author.create({ data: { email: "foo" } });

//   await prisma.post.create({
//     data: {
//       title: "Types of relations",
//       tags: {
//         create: [
//           { name: "dev", author: { connect: { id: a.id } } },
//           { name: "prisma", author: { connect: { id: a.id } } },
//         ],
//       },
//       author: {
//         connect: {
//           id: a.id,
//         },
//       },
//     },
//   });
// }

// main();
