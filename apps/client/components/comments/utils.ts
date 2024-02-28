interface Comment {
  replies: Comment[];
}
export const totalComments = (comments: Comment[]) =>
  comments.reduce((acc, comment) => {
    return acc + comment.replies.length;
  }, 0) + comments.length;
