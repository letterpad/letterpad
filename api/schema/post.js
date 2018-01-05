export default `
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

  type PostNode {
      count: Int,
      rows: [Post]
  }

  type PostTaxonomy {
    id: Int
    name: String
    type: String
    post_count: Int
    posts(type:String): [Post]
  }

  type AdjacentPosts {
    previous: Post,
    next: Post
  }

  input TaxonomyInputType {
    id: Int
    name: String
    type: String
  }

  type Response {
    ok: Boolean!
    post: Post,
    errors: [Error!]
  }

  type Query {
    post(id: Int, type: String, slug: String): Post
    posts(type: String, body: String, status: String, offset: Int, limit: Int, cursor: Int): PostNode
    postsMenu(slug: String,type: String, name: String, postType: String): [PostTaxonomy]
    pageMenu(slug: String, name: String, postType: String): Post
    postTaxonomies(type: String, name: String, postType: String): [PostTaxonomy]
    adjacentPosts(type: String, slug:String): AdjacentPosts
  }

  type Mutation {
    createPost(id: Int, title: String, body: String, author: String, excerpt: String, cover_image: String, type:                String, status: String, slug: String, taxonomies: [TaxonomyInputType]):Response!
    updatePost(id: Int, title: String, body: String, author: String, excerpt: String, cover_image: String, type:                String, status: String, slug: String, taxonomies: [TaxonomyInputType]): Response!
    uploadFile(id: Int, cover_image: String):Response!
  }
`;
