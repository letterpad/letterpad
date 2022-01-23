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
  template_id: string = this["template_id"];
  body: string = this["body"];
  subject: string = this["subject"];

  readonly createdAt: Date = this["createdAt"];
  readonly updatedAt: Date = this["updatedAt"];

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
