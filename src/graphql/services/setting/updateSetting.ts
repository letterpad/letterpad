import {
  MutationUpdateOptionsArgs,
  ResolversTypes,
  Setting,
} from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";
import { mapSettingToGraphql } from "@/graphql/resolvers/mapper";
import { ValueOf } from "@/graphql/types";
import logger from "@/shared/logger";

export const updateSetting = async (
  args: MutationUpdateOptionsArgs,
  { prisma, session }: ResolverContext,
): Promise<ResolversTypes["SettingResponse"]> => {
  if (!session?.user.id) {
    return {
      __typename: "UnAuthorized",
      message: "You are not authenticated",
    };
  }
  const author_id = session?.user.id;
  if (author_id) {
    const author = await prisma.author.findFirst({
      where: { id: author_id },
      include: {
        setting: true,
      },
    });
    const setting_id = author?.setting?.id;
    if (!setting_id)
      return { __typename: "NotFound", message: "Setting now found" };

    const promises = args.options.map((setting) => {
      const option = Object.keys(setting)[0] as keyof Omit<
        Setting,
        "__typename"
      >;
      let value = Object.values(setting)[0] as ValueOf<Setting>;

      if (option === "css") {
        setting.css = (value as string) || "";
      }
      const isImageOption =
        setting.banner || setting.site_logo || setting.site_favicon;

      const internalImage = isImageOption?.src.startsWith(process.env.ROOT_URL);
      if (isImageOption && internalImage) {
        isImageOption.src = isImageOption.src?.replace(
          process.env.ROOT_URL,
          "",
        );

        value = JSON.stringify(isImageOption);
      }
      if (["menu", "banner", "site_logo", "site_favicon"].includes(option)) {
        value = JSON.stringify(value);
      }
      logger.info(
        `Updating settings with id ${setting_id}- ` + option + " : " + value,
      );

      return prisma.setting.update({
        data: {
          [option]: value,
        },
        where: { id: setting_id },
      });
    });

    await Promise.all(promises);

    const setting = await prisma.setting.findUnique({
      where: { id: setting_id },
    });
    if (setting) {
      return {
        ...mapSettingToGraphql(setting),
        site_url: `https://${author?.username}.letterpad.app`,
        __typename: "Setting",
      };
    }
    throw Error("Couldnt find setting");
  }
  return {
    message: "You are not authorized",
    __typename: "UnAuthorized",
  };
};
