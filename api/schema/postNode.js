import Taxonomy from "./taxonomy";
import Author from "./author";
const PostNode = `
  type PostNode {
    total: Int!,
    rows: [POST]
  }
`;
// we export Author and all types it depends on
// in order to make sure we don't forget to include
// a dependency
export default () => [Post, Taxonomy, Author];
