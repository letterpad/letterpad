interface Comment {
  replies?: (Comment | null)[] | null;
}
export const totalComments = (comments: (Comment | null)[]) => {
  const validComments = comments.filter(
    (comment): comment is Comment => Boolean(comment)
  );
  return (
    validComments.reduce(
      (acc, comment) =>
        acc +
        (Array.isArray(comment.replies)
          ? comment.replies.filter(Boolean).length
          : 0),
      0
    ) + validComments.length
  );
};
