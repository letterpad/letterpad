import { PrismaClient } from "@prisma/client";

export let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

// export const prisma;
export type PrismaType = typeof prisma;
