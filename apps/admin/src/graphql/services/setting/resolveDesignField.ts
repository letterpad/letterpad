import { Design, ResolversParentTypes } from "@/__generated__/__types__";

export const resolveDesignField = async (
  design: Design | string | undefined
): Promise<ResolversParentTypes["Design"]> => {
  design = parse(design ?? "{}") as Design;
  return {
    primary_font: "Inter",
    secondary_font: "Lato",
    ...design,
  };
};

const parse = (str: string | object) => {
  return typeof str === "string" ? JSON.parse(str) : str;
};
