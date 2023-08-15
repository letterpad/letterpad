import { Design, ResolversParentTypes } from "@/__generated__/__types__";

export const resolveDesignField = async (
  design: Design | string | undefined
): Promise<ResolversParentTypes["Design"]> => {
  design = parse(design ?? "{}") as Design;
  return {
    ...design,
    primary_font: design.primary_font ?? "Inter",
    secondary_font: design.secondary_font ?? "Lora",
  };
};

const parse = (str: string | object) => {
  return typeof str === "string" ? JSON.parse(str) : str;
};
