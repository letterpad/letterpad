import {
  DeleteTagsDocument,
  TagDocument,
  TagsDocument, UpdateTagsDocument
} from "letterpad-graphql";

import { API } from "@/../tests/testClient";

describe("Test Tags Graphql API", () => {
  it("get tags", async () => {
    const result = await API({ query: TagsDocument, variables: {} });
    expect(result.tags.rows).toEqual(
      expect.arrayContaining([
        {
          name: "home",
          posts: {
            __typename: "PostsNode",
            count: 3,
            rows: result.tags.rows[0].posts.rows,
          },
          slug: "/tag/home",
          id: "home",
          type: "tag",
        },
        {
          name: "first-post",
          posts: {
            __typename: "PostsNode",
            count: 3,
            rows: result.tags.rows[1].posts.rows,
          },
          slug: "/tag/first-post",
          id: "first-post",
          type: "tag",
        },
      ])
    );
  });

  it("can update tags", async () => {
    const result = await API({
      query: UpdateTagsDocument,
      variables: {
        data: {
          name: "new tag",
          slug: "new-tag",
          old_name: "first-post",
        },
      },
    });
    expect(result.updateTags.ok).toBe(true);

    const response = await API({
      query: TagDocument,
      variables: {
        slug: "new-tag",
      },
    });

    expect(response.tag).toEqual({
      __typename: "Tag",
      name: "new-tag",
      slug: "/tag/new-tag",
      type: "tag",
      id: "new-tag",
    });
  });

  it("can delete tags", async () => {
    const result = await API({
      query: DeleteTagsDocument,
      variables: {
        name: "new tag",
      },
    });
    expect(result.deleteTags.ok).toBe(true);
  });
});
export { };
