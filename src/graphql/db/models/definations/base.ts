import {
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
} from "sequelize-typescript";

export class BaseModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  public id!: number;

  @Column({
    type: DataType.DATE,
    get() {
      return getReadableDate(this.getDataValue("createdAt") || new Date());
    },
  })
  public createdAt!: string;

  @Column({
    type: DataType.DATE,
    get() {
      return getReadableDate(this.getDataValue("updatedAt") || new Date());
    },
  })
  public updatedAt!: string;
}

const getReadableDate = (timestamp: Date) => {
  return new Date(timestamp).toLocaleString("en-us", {
    month: "long",
    year: "numeric",
    day: "numeric",
  });
};
