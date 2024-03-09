import { prisma } from "@/lib/prisma";

import { Navigation, NavigationType } from "@/__generated__/__types__";

interface UpdateMenuProps {
  authorId: string;
  isPage: boolean;
  slug: string;
  originalName?: string;
  prevOriginalName: string;
}
export async function updateMenuOnTitleChange(props: UpdateMenuProps) {
  const { isPage, prevOriginalName, originalName, authorId, slug } = props;

  if (isPage) {
    const author = await prisma.author.findFirst({
      where: { id: authorId },
      include: { setting: true },
    });
    if (!author) return false;
    const jsonMenu = JSON.parse(author.setting?.menu || "[]") as Navigation[];

    const updatedMenu = jsonMenu.map((item) => {
      if (
        item.type === NavigationType.Page &&
        item.original_name === prevOriginalName
      ) {
        if (originalName) item.original_name = originalName;
        item.slug = slug;
      }
      return item;
    });

    await prisma.author.update({
      data: {
        setting: {
          update: {
            menu: JSON.stringify(updatedMenu),
          },
        },
      },
      where: { id: authorId },
    });
  }
}
