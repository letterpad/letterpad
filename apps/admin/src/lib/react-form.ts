import { DeepMap } from "react-hook-form";

export const getDirtyFields = <T>(
  data: T,
  dirtyFields: Partial<DeepMap<T, boolean>> | any
) => {
  const result = Object.entries(dirtyFields).reduce((acc, [key]) => {
    acc[key] = data[key];

    return acc;
  }, {});
  return result as T;
};
