import { Design } from "letterpad-graphql";

export const resolveDesignField = async (
  design: Design | string | undefined
): Promise<Design> => {
  design = parse(design ?? "{}") as Design;
  return {
    ...design,
    primary_font: design?.primary_font ?? "Noto_Sans",
    secondary_font: design?.secondary_font ?? "Lora",
  };
};

const parse = (str: string | object) => {
  return typeof str === "string" ? JSON.parse(str) : str;
};
