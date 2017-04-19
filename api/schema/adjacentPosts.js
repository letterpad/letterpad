import Post from "./post";
const AdjacentPosts = `
  type AdjacentPosts {
    previous: Post,
    next: Post
  }
`;

export default () => [AdjacentPosts, Post];
