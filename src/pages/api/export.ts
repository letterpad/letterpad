import { IImportExportData } from "../../components/import-export/importExportTypes";
import { SessionData } from "./../../graphql/types";
import fs from "fs";
import { getSession } from "next-auth/react";
import { Role } from "@graphql-types@";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { validateWithAjv } from "@/components/import-export/schema";

const Export = async (req: NextApiRequest, res: NextApiResponse) => {
  const _session = await getSession({ req });
  const session = _session as unknown as { user: SessionData };
  if (!session?.user?.email) return res.send("No session found");

  const isAdmin = session.user.role === Role.Admin;

  const authors = await prisma.author.findMany({
    include: {
      posts: {
        include: {
          tags: true,
        },
      },
      setting: true,
      subscribers: true,
      uploads: true,
    },
    where: {
      id: isAdmin ? undefined : session.user.id,
    },
  });

  let data: IImportExportData = { authors: {} };
  authors.forEach((author) => {
    //@ts-ignore
    data.authors[author.email] = author;
  });

  if (!isAdmin) {
    data = validateWithAjv(data);
  }
  fs.writeFileSync("data.json", JSON.stringify(data, null, 2), "utf-8");

  const stat = fs.statSync("data.json");

  res.writeHead(200, {
    "Content-Type": "application/json",
    "Content-Length": stat.size,
    "Content-Disposition": `attachment; filename=\"data.json\"`,
  });

  const readStream = fs.createReadStream("data.json");
  readStream.pipe(res);
};

export default Export;
