import {
  CreatePostDocument,
  PostsDocument, PostStatusOptions, UpdatePostDocument
} from "letterpad-graphql";

import { API } from "@/../tests/testClient";
import { createPathWithPrefix, textToSlug } from "@/utils/slug";
describe("Test Post Query Graphql API", () => {
  it("get all posts", async () => {
    const result = await API({ query: PostsDocument, variables: {} });
    const firstRecord = result.posts.rows[0];

    // expect(firstRecord.id).toBe(1);
    expect(result.posts.count).toBe(3);

    expect(firstRecord.cover_image).toEqual({
      src: expect.stringContaining("unsplash"),
      width: 100,
      height: 100,
    });

    expect(firstRecord.tags.rows).toEqual(
      expect.arrayContaining([
        { name: "home", slug: "/tag/home" },
        {
          name: "first-post",
          slug: "/tag/first-post",
        },
      ])
    );

    expect(firstRecord.author).toEqual({
      bio: "You can write some information about yourself for the world to know you a little better.",
      company_name: "Letterpad",
      name: "Robert Smith",
      occupation: "Author at Letterpad",
      social: {
        facebook: "",
        github: "",
        instagram: "",
        linkedin: "",
        twitter: "",
      },
    });
  });

  it("get all posts of a tag", async () => {
    const result = await API({
      query: PostsDocument,
      variables: { filters: { tagSlug: "home" } },
    });
    expect(result.posts.count).toBe(3);

    const result2 = await API({
      query: PostsDocument,
      variables: { filters: { tagSlug: "invalid" } },
    });
    expect(result2.posts.count).toBe(0);

    const result3 = await API({
      query: PostsDocument,
      variables: { filters: { tagSlug: "/" } },
    });
    expect(result3.posts.count).toBe(3);
  });
});

const title = "New Post";
describe("Test Post Query Graphql API", () => {
  it("Create a post", async () => {
    const post = await runQuery(CreatePostDocument, { title, type: "post" });
    expect(post.createPost).toEqual(
      expect.objectContaining({
        slug: createPathWithPrefix(textToSlug(title), "post"),
        title: "New Post",
        status: PostStatusOptions.Draft,
      })
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
        height: 400,
        width: 600,
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
});
export { };

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

export { };
