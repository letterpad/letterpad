import { DataTypes, Model } from "sequelize";

export interface EmailAttributes {
  template_id: string;
  body: string;
  subject: string;
}

export class Email
  extends Model<EmailAttributes, EmailAttributes>
  implements EmailAttributes
{
  public template_id!: string;
  public body!: string;
  public subject!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  constructor(...args) {
    super(...args);
  }
}

export default function initEmail(sequelize) {
  Email.init(
    {
      template_id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      subject: {
        type: DataTypes.STRING,
      },
      body: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: "emails",
      sequelize, // passing the `sequelize` instance is required
    },
  );

  return Email;
}

export function associateEmail(): void {}
