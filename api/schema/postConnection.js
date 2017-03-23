import PageInfo from "./pageInfo";
import PostEdge from "./postEdge";
const PostConnection = `
  type PostConnection {
    pageInfo: PageInfo!
    edges: [PostEdge]
  }
`;

export default () => [PostConnection, PostEdge, PageInfo];
