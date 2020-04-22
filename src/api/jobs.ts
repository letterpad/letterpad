import { Op } from "sequelize";
import { PostStatusOptions } from "../__generated__/gqlTypes";
import { mdToHtml } from "letterpad-editor";
import models from "./models";

export function publishScheduledPosts() {
  const oneMin = 1000 * 60;
  setInterval(async () => {
    const scheduledPosts = await models.Post.findAll({
      attributes: ["id", "scheduledAt", "md_draft"],
      where: {
        scheduledAt: {
          [Op.ne]: null,
        },
      },
      raw: true,
    });
    const currentDate = new Date();

    if (scheduledPosts.length > 0) {
      for (let i = 0; i < scheduledPosts.length; i++) {
        //@ts-ignore
        const { scheduledAt, md_draft, id } = scheduledPosts[i];

        if (currentDate.getTime() >= new Date(scheduledAt).getTime()) {
          // publish this post;
          await models.Post.update(
            {
              scheduledAt: null,
              html: mdToHtml(md_draft),
              md_draft: "",
              status: PostStatusOptions.Publish,
            },
            {
              where: {
                id,
                status: PostStatusOptions.Draft,
              },
            },
          );
        }
      }
    }
  }, oneMin * 15);
}
