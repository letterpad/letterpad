import {
  CreatePostDocument,
  UpdatePostDocument,
} from "@/__generated__/src/graphql/queries/mutations.graphql";
import { API } from "../../../tests/testClient";
import { toSlug } from "./helpers";
import { PostStatusOptions } from "@/__generated__/__types__";

const title = "New Post";
describe("Test Post Query Graphql API", () => {
  it("Create a post", async () => {
    const post = await runQuery(CreatePostDocument, { title, type: "post" });
    expect(post.createPost).toEqual(
      expect.objectContaining({
        slug: "/post/" + toSlug(title),
        title: "New Post",
        status: PostStatusOptions.Draft,
      }),
    );
  });

  it("Create a post with same title twice and validate slug", async () => {
    const type = "post";
    const post1 = await runQuery(CreatePostDocument, { title: "Foo", type });
    const post2 = await runQuery(CreatePostDocument, { title: "Foo", type });
    const post3 = await runQuery(CreatePostDocument, { title: "Foo", type });

    const slugOfPost2 = post1.createPost.slug + "-1";
    const slugOfPost3 = post1.createPost.slug + "-2";
    expect(post1.createPost.slug).toBe(`/${type}/foo`);
    expect(slugOfPost2).toBe(post2.createPost.slug);
    expect(slugOfPost3).toBe(post3.createPost.slug);
  });

  it("Should update cover_image dimentions", async () => {
    const type = "post";
    const post = await runQuery(CreatePostDocument, {
      title: "Test Cover Image",
      type,
    });

    const updatedPost = await runQuery(UpdatePostDocument, {
      id: post.createPost.id,
      cover_image: {
        src: "https://dummyimage.com/600x400/000/fff",
      },
    });

    expect(updatedPost.updatePost.cover_image.height).toBe(400);
    expect(updatedPost.updatePost.cover_image.width).toBe(600);
  });

  it("Should update slug if passed", async () => {
    const type = "post";
    const post = await runQuery(CreatePostDocument, {
      title: "Another Test Post",
      type,
    });

    const { updatePost } = await runQuery(UpdatePostDocument, {
      id: post.createPost.id,
      title: "New Title",
      slug: "new-slug",
    });

    expect(updatePost.slug).toBe("/post/new-slug");
  });

  it("Check republish works", async () => {
    const type = "post";
    const oldHtml = "<html><body><h1>This is a new post</h1></body></html>";

    const newHtml = "<html><body><h1>Change</h1></body></html>";

    const post = await runQuery(CreatePostDocument, {
      title: "Published Post",
      type,
      status: PostStatusOptions.Published,
      html: oldHtml,
    });

    const { updatePost } = await runQuery(UpdatePostDocument, {
      id: post.createPost.id,
      html: newHtml,
    });

    // updated post will not be live.
    expect(updatePost.html).toBe(oldHtml);

    // add the status to force republish and go live
    const updatedPost = await runQuery(UpdatePostDocument, {
      id: post.createPost.id,
      html: newHtml,
      status: PostStatusOptions.Published,
    });

    expect(updatedPost.updatePost.html).toBe(newHtml);
  });
});
export {};

async function runQuery(query, args) {
  return API({
    query,
    variables: {
      data: {
        ...args,
      },
    },
  });
}
