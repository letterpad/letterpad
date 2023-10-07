import { Permissions } from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";

export const getPermissionFromAuthor = async (
  id: number,
  { prisma, dataloaders }: ResolverContext
): Promise<Permissions[]> => {
  const author = await dataloaders.author.load(id);
  // const author = await prisma.author.findFirst({
  //   where: { id },
  // });
  if (!author || !author.role_id) return [];
  const permissions = await prisma.rolePermissions.findMany({
    where: { role_id: author.role_id },
    include: {
      permission: true,
    },
  });
  return permissions?.map((p) => p.permission.name as Permissions);
};
