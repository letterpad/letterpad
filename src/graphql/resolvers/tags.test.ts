import { TagsDocument } from "./../../../__generated__/src/graphql/queries/queries.graphql";
// import { UpdateOptionsDocument } from "../../../__generated__/src/graphql/queries/mutations.graphql";
// import { SettingsDocument } from "@/__generated__/queries/queries.graphql";
// import models from "../db/models";
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

  it("can create tags", () => {
    // const result = await API({query: })
  });
});
export {};
