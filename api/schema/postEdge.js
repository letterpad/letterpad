import Post from "./post";
const PostEdge = `
  type PostEdge {
    node: Post,
    cursor: String
  }
`;

export default () => [PostEdge, Post];
