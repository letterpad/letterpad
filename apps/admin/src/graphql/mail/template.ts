import { prisma } from "@/lib/prisma";

import { EmailTemplates } from "../types";

export async function getTemplate(template: EmailTemplates) {
  const data = await prisma.emailTemplates.findFirst({
    where: { template },
  });

  return data ?? { body: "", subject: "" };
}
