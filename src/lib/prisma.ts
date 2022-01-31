import { PrismaClient } from "@prisma/client";
const client = new PrismaClient();
export const prisma = client;
export type PrismaType = typeof prisma;

// async function main() {
//   await prisma.author.delete({ where: { email: "demo@demo.com" } });
// }

// main();
