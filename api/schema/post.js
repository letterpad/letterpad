import Taxonomy from "./taxonomy";
import Author from "./author";
const Post = `
  type Post {
    id: Int
    title: String
    body: String
    author: Author
    excerpt: String
    cover_image: String
    type: String
    status: String
    slug: String
    created_at: String
    taxonomies: [Taxonomy]
  }
`;
// we export Author and all types it depends on
// in order to make sure we don't forget to include
// a dependency
export default () => [Post, Taxonomy, Author];
