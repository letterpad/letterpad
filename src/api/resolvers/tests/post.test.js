import constants from "../../utils/constants";
import { graphql } from "graphql";
import models from "../../models";
import schema from "../../schema";
import { seed } from "../../seed/seed.js";

describe("Testing Post Resolvers", () => {
  beforeAll(async () => {
    // console.time = jest.fn();
    return await seed(models, false);
  });

  it("Creates new post", async () => {
    const testCase = {
      query: `
        mutation createPost($type: String!) {
          createPost(type: $type) {
            ok
          }
        }
      `,
      variables: {
        type: "post",
      },
      // injecting the mock movie service with canned responses
      context: {
        user: { id: 1, permissions: ["MANAGE_ALL_POSTS"] },
        error: null,
        SECRET: constants.SECRET,
        admin: true,
        models: models,
      },
      // expected result
      expected: { data: { createPost: { ok: true } } },
    };
    const result = await graphql(
      schema,
      testCase.query,
      null,
      testCase.context,
      testCase.variables,
    );
    expect(result).toEqual(testCase.expected);
  });

  it("Updates a post", async () => {
    const testCase = {
      query: `
        mutation updatePost(
          $id: Int!
          $title: String!
          $body: String
          $status: String!
          $excerpt: String
          $cover_image: String
          $taxonomies: [TaxonomyInputType]
          $slug: String
        ) {
          updatePost(
            id: $id
            title: $title
            body: $body
            status: $status
            excerpt: $excerpt
            taxonomies: $taxonomies
            slug: $slug
            cover_image: $cover_image
          ) {
            ok
            post {
              id
              slug
            }
          }
        }
      `,
      variables: {
        id: 1,
        title: "Foo Bar",
        body: "hello body",
        status: "published",
        excerpt: "exceprt follows here",
        slug: "hello-world",
      },
      // injecting the mock movie service with canned responses
      context: {
        user: { id: 1, permissions: ["MANAGE_ALL_POSTS"] },
        error: null,
        SECRET: constants.SECRET,
        admin: true,
        models: models,
      },
      // expected result
      expected: {
        data: {
          updatePost: { ok: true, post: { id: 1, slug: "hello-world" } },
        },
      },
    };
    const result = await graphql(
      schema,
      testCase.query,
      null,
      testCase.context,
      testCase.variables,
    );
    expect(result).toEqual(testCase.expected);
  });

  it("Deletes a post", async () => {
    const testCase = {
      query: `
        mutation deletePosts($ids: String!) {
          deletePosts(ids: $ids) {
            ok
          }
        }
      `,
      variables: {
        ids: "1",
      },
      // injecting the mock movie service with canned responses
      context: {
        user: { id: 1, permissions: ["MANAGE_ALL_POSTS"] },
        error: null,
        SECRET: constants.SECRET,
        admin: true,
        models: models,
      },
      // expected result
      expected: { data: { deletePosts: { ok: true } } },
    };
    const result = await graphql(
      schema,
      testCase.query,
      null,
      testCase.context,
      testCase.variables,
    );
    expect(result).toEqual(testCase.expected);
  });
  it("Query single post by id", async () => {
    const testCase = {
      query: `
        query getPost($id: Int!) {
          post(id: $id) {
            id
          }
        }
      `,
      variables: {
        id: 1,
      },
      // injecting the mock movie service with canned responses
      context: {
        user: { id: 1, permissions: ["MANAGE_ALL_POSTS"] },
        error: null,
        SECRET: constants.SECRET,
        admin: true,
        models: models,
      },
      // expected result
      expected: { data: { post: { id: 1 } } },
    };
    const result = await graphql(
      schema,
      testCase.query,
      null,
      testCase.context,
      testCase.variables,
    );
    expect(result).toEqual(testCase.expected);
  });

  it("Query single post by slug", async () => {
    const testCase = {
      query: `
        query singlePost($type: String, $slug: String) {
          post(type: $type, slug: $slug) {
            id
          }
        }
      `,
      variables: {
        type: "post",
      },
      // injecting the mock movie service with canned responses
      context: {
        user: { id: 1, permissions: ["MANAGE_ALL_POSTS"] },
        error: null,
        SECRET: constants.SECRET || "test",
        admin: true,
        models: models,
      },
      // expected result
      expected: { data: { post: { id: 1 } } },
    };
    const result = await graphql(
      schema,
      testCase.query,
      null,
      testCase.context,
      testCase.variables,
    );
    expect(result).toEqual(testCase.expected);
  });

  it("Posts by taxonomy slug", async () => {
    const testCase = {
      query: `
        query catPosts(
          $type: String!
          $slug: String!
          $postType: String
          $offset: Int
          $limit: Int
        ) {
          postsByTaxSlug(
            type: $type
            slug: $slug
            postType: $postType
            offset: $offset
            limit: $limit
          ) {
            count
            posts {
              id
            }
          }
        }
      `,
      variables: {
        type: "post_category",
        slug: "abstract",
      },
      // injecting the mock movie service with canned responses
      context: {
        user: { id: 1, permissions: ["MANAGE_ALL_POSTS"] },
        error: null,
        SECRET: constants.SECRET || "test",
        admin: true,
        models: models,
      },
    };
    const result = await graphql(
      schema,
      testCase.query,
      null,
      testCase.context,
      testCase.variables,
    );
    expect(result.data.postsByTaxSlug.count).toBeGreaterThan(1);
  });

  it("Gets adjacent posts by slug", async () => {
    const testCase = {
      query: `
        query adjacentPosts($slug: String) {
          adjacentPosts(type: "post", slug: $slug) {
            next {
              title
            }
            previous {
              title
            }
          }
        }
      `,
      variables: {
        slug: "post-11",
      },
      // injecting the mock movie service with canned responses
      context: {
        error: null,
        SECRET: constants.SECRET || "test",
        admin: true,
        models: models,
      },
    };
    const result = await graphql(
      schema,
      testCase.query,
      null,
      testCase.context,
      testCase.variables,
    );
    expect(result.data.adjacentPosts.next.title.length).toBeGreaterThan(0);
    expect(result.data.adjacentPosts.previous.title.length).toBeGreaterThan(0);
  });
});
