export const deletePostResolver = async (root, args, { models }) => {
  const { deleteFromSystem, ids } = args;
  try {
    const hardDelete = deleteFromSystem || false;
    if (hardDelete) {
      await models.Post.destroy({
        where: { id: args.ids },
      });
      return {
        ok: true,
      };
    }
    await models.Post.update(
      { status: "trash" },
      {
        where: {
          id: ids,
        },
      },
    );
    return {
      ok: true,
    };
  } catch (e) {
    return {
      ok: false,
      errors: [
        {
          message: e.message,
          path: "deleteMessage",
        },
      ],
    };
  }
};
