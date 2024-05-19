import {
  MutationUpdateOptionsArgs,
  Setting,
  SettingResponse,
} from "letterpad-graphql";

import { ResolverContext } from "@/graphql/context";
import { mapSettingToGraphql } from "@/graphql/resolvers/mapper";
import { getRootUrl } from "@/shared/getRootUrl";
import logger from "@/shared/logger";

export const updateSetting = async (
  args: MutationUpdateOptionsArgs,
  { prisma, session }: ResolverContext
): Promise<SettingResponse> => {
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
    const settings = args.options.pop();
    if (!setting_id || !settings)
      return { __typename: "NotFound", message: "Setting now found" };

    const data = {} as ChangeTypeOfKeys<
      Omit<Setting, "__typename">,
      "menu" | "banner" | "site_logo" | "site_favicon" | "design",
      string
    >;

    Object.keys(settings).map((option) => {
      let value = settings[option];

      if (option === "css") {
        value = value ?? "";
      }
      const isImageOption =
        settings.banner || settings.site_logo || settings.site_favicon;

      const internalImage = isImageOption?.src.startsWith(getRootUrl());
      if (isImageOption && internalImage) {
        isImageOption.src = isImageOption.src?.replace(getRootUrl(), "");

        value = JSON.stringify(isImageOption);
      }
      if (
        ["menu", "banner", "site_logo", "site_favicon", "design"].includes(
          option
        )
      ) {
        value = JSON.stringify(value);
      }

      data[option] = value;
    });
    if (settings.site_url) {
      try {
        const res = await fetch(settings.site_url)
        const isLetterpadSite = res.headers.get('x-platform') === "Letterpad"
        if (!isLetterpadSite) {
          return {
            message: "The site url is not a valid Letterpad site",
            __typename: "NotFound"
          };
        }
      } catch (e) {
        return {
          message: "The site url is not a valid Letterpad site",
          __typename: "NotFound"
        };
      }
    }
    logger.info(`Updating settings with id ${setting_id}- `, data);
    const res = await prisma.setting.update({
      data,
      where: { id: setting_id },
    });
    const setting = await prisma.setting.findUnique({
      where: { id: setting_id },
    });

    if (setting) {
      return {
        ...mapSettingToGraphql(setting),
        site_url: res.site_url ?? `https://${author?.username}.letterpad.app`,
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

export type ChangeTypeOfKeys<
  T extends object,
  Keys extends keyof T,
  NewType,
> = {
    // Loop to every key. We gonna check if the key
    // is assignable to Keys. If yes, change the type.
    // Else, retain the type.
    [key in keyof T]: key extends Keys ? NewType : T[key];
  };
