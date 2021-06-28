import { PostsDocument } from "../../../__generated__/src/graphql/queries/queries.graphql";
import { API } from "../../../tests/testClient";

describe("Test Post Query Graphql API", () => {
  it("get all posts", async () => {
    const result = await API({ query: PostsDocument, variables: {} });
    const firstRecord = result.posts.rows[0];

    expect(firstRecord.id).toBe(1);
    expect(result.posts.count).toBe(3);

    expect(firstRecord.cover_image).toEqual({
      src: expect.stringContaining("unsplash"),
      width: 0,
      height: 0,
    });

    expect(firstRecord.tags).toEqual(
      expect.arrayContaining([
        { desc: "", id: 1, name: "Home", slug: "/tag/home" },
        { desc: "", id: 2, name: "first-post", slug: "/tag/first-post" },
      ]),
    );

    expect(firstRecord.author).toEqual({
      bio: "You can some information about yourself for the world to know you a little better.",
      name: "Demo Author",
      social: {
        github: "https://github.com",
        instagram: "https://instagram.com",
        twitter: "https://twitter.com",
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
export {};
