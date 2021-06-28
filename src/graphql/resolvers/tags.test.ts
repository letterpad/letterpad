import {
  DeleteTagsDocument,
  UpdateTagsDocument,
} from "./../../../__generated__/src/graphql/queries/mutations.graphql";
import {
  TagDocument,
  TagsDocument,
} from "./../../../__generated__/src/graphql/queries/queries.graphql";
import { API } from "../../../tests/testClient";

describe("Test Tags Graphql API", () => {
  it("get tags", async () => {
    const result = await API({ query: TagsDocument, variables: {} });
    expect(result.tags.rows).toEqual(
      expect.arrayContaining([
        {
          desc: "",
          id: 1,
          name: "Home",
          posts: { count: 3, rows: [{ id: 1 }, { id: 2 }, { id: 3 }] },
          slug: "/tag/home",
        },
        {
          desc: "",
          id: 2,
          name: "first-post",
          posts: { count: 3, rows: [{ id: 1 }, { id: 2 }, { id: 3 }] },
          slug: "/tag/first-post",
        },
      ]),
    );
  });

  it("can create tags", async () => {
    const result = await API({
      query: UpdateTagsDocument,
      variables: {
        data: {
          id: 0,
          name: "new tag",
          slug: "new-tag",
          desc: "tag desc",
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
      name: "new tag",
      slug: "/tag/new-tag",
      desc: "tag desc",
    });
  });

  it("can delete tags", async () => {
    const result = await API({
      query: DeleteTagsDocument,
      variables: {
        id: 3,
      },
    });
    expect(result.deleteTags.ok).toBe(true);
  });
});
export {};
