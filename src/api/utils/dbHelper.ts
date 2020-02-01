import { Model } from "sequelize";

export const dbResultToPlainArray = <T extends Model>(result: Array<T>) => {
  return result.map((el: T) => el.get({ plain: true }));
};
