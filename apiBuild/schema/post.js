"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

var _default = "\n  type Post {\n    id: Int\n    title: String\n    body: String\n    author: Author\n    excerpt: String\n    cover_image: String\n    type: String\n    status: String\n    mdBody: String\n    mdPreview: String\n    slug: String\n    mode: String\n    created_at: String\n    taxonomies: [Taxonomy]\n  }\n  type PostNode {\n      count: Int,\n      rows: [Post]\n  }\n  type PostTaxonomyNode {\n    count: Int,\n    posts: [Post]\n  }\n\n  type AdjacentPosts {\n    previous: Post,\n    next: Post\n  }\n  input TaxonomyInputType {\n    id: Int\n    name: String\n    type: String\n  }\n  type Response {\n    ok: Boolean!\n    post: Post\n    errors: [Error!]\n  }\n  type PostStatus {\n    published: Int\n    drafts: Int\n  }\n  type Stats {\n    posts: PostStatus\n    pages: PostStatus\n    tags: Int\n    categories: Int\n  }\n  type Query {\n    post(id: Int, type: String, slug: String): Post\n    posts(type: String, body: String, status: String, offset: Int, limit: Int, cursor: Int): PostNode\n    postsMenu(slug: String,type: String, name: String, postType: String,offset: Int, limit: Int, cursor: Int): PostTaxonomyNode\n    pageMenu(slug: String, name: String, postType: String): Response\n    postsByTaxSlug(type: String, slug: String, postType: String, offset: Int, limit: Int, cursor: Int): PostTaxonomyNode\n    adjacentPosts(type: String, slug:String): AdjacentPosts\n    stats: Stats\n  }\n  type Mutation {\n    createPost(id: Int, title: String, body: String, author_id: Int, mode: String, excerpt: String, cover_image: String, type: String, status: String, slug: String, taxonomies: [TaxonomyInputType]):Response!\n    updatePost(id: Int, title: String, body: String, mdBody: String, mdPreview: String, author_id: Int, mode: String, excerpt: String, cover_image: String, type: String, status: String, slug: String, taxonomies: [TaxonomyInputType]): Response!\n    deletePosts(ids: String!): Response!\n    uploadFile(id: Int, cover_image: String):Response!\n  }\n";
exports.default = _default;
;

(function () {
  var reactHotLoader = require('react-hot-loader').default;

  var leaveModule = require('react-hot-loader').leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(_default, "default", "api/schema/post.js");
  leaveModule(module);
})();

;