import Post from "./post";
const PostTaxonomy = `
  type PostTaxonomy {
    id: Int
    name: String
    type: String
    post_count: Int
    posts(type:String): [Post]
  }
`;

export default () => [PostTaxonomy, Post];
