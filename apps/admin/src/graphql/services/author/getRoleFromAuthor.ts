import { Role } from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";

export const getRoleFromAuthor = async (
  id: number,
  { prisma }: ResolverContext
): Promise<Role> => {
  const author = await prisma.author.findFirst({
    where: { id },
  });
  if (!author?.role_id) return Role.Author;

  const role = await prisma.role.findFirst({
    where: { id: author.role_id },
  });
  if (!role?.name) return Role.Author;

  return role?.name as Role;
};
