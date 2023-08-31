import { NavigationType } from "../../../../__generated__/__types__";
import { IMenuWithError } from "../../../types";

export const createNewRow = (libraries: IMenuWithError[]) => {
  return {
    id: generareId(libraries),
    label: "",
    slug: "",
    type: NavigationType.Custom,
    original_name: "",
  };
};

const generareId = (menu: IMenuWithError[]) => {
  const ids = menu.map((item) => item.id) as number[];
  const id = Math.max.apply(null, ids);

  return id + 1;
};

export const mergeData = (
  libraries: IMenuWithError[],
  change: IMenuWithError
) => {
  return libraries.map((item) => (item.id === change.id ? change : item));
};
