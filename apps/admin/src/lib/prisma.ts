/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({

    log: [
      {
        emit: "event",
        level: "query",
      },
      // {
      //   emit: "stdout",
      //   level: "error",
      // },
      // {
      //   emit: "stdout",
      //   level: "info",
      // },
      // {
      //   emit: "stdout",
      //   level: "warn",
      // },
    ],
  });
export default PrismaClient;


if (process.env.NODE_ENV !== 'production' && !global.prisma) {
  // prisma.$use(async (params, next) => {
  //   const before = Date.now()
  //   await next(params)
  //   const after = Date.now()
  //   // console.log(
  //   //   `Query ${params.model}.${params.action} took ${after - before}ms`
  //   // )
  // })

  global.prisma = prisma
}