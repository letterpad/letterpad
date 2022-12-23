import {
  DeleteTagsDocument,
  UpdateTagsDocument,
} from "@/__generated__/src/graphql/queries/mutations.graphql";
import {
  TagDocument,
  TagsDocument,
} from "@/__generated__/src/graphql/queries/queries.graphql";

import { API } from "../../../tests/testClient";

describe("Test Tags Graphql API", () => {
  it("get tags", async () => {
    const result = await API({ query: TagsDocument, variables: {} });
    expect(result.tags.rows).toEqual(
      expect.arrayContaining([
        {
          name: "home",
          posts: {
            count: 3,
            rows: result.tags.rows[0].posts.rows,
          },
          slug: "/tag/home",
        },
        {
          name: "first-post",
          posts: {
            count: 3,
            rows: result.tags.rows[1].posts.rows,
          },
          slug: "/tag/first-post",
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
      name: "new-tag",
      slug: "/tag/new-tag",
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
export {};
