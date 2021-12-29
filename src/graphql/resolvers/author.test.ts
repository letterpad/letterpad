import { PostsDocument } from "./../../../__generated__/src/graphql/queries/queries.graphql";
import {
  CreateAuthorDocument,
  LoginDocument,
} from "./../../../__generated__/src/graphql/queries/mutations.graphql";
import { API } from "tests/testClient";
import models from "@/graphql/db/models";

describe("Test author", () => {
  it("can login", async () => {
    const result = await API({
      query: LoginDocument,
      variables: { data: { email: "demo@demo.com", password: "demo" } },
    });

    expect(result.login.id).toBeGreaterThan(0);
  });

  it("can register", async () => {
    const resonse = await API({
      query: CreateAuthorDocument,
      variables: {
        data: {
          name: "foo",
          email: "foo@foo.fail",
          password: "foofoofoo",
          site_title: "hello",
          username: "foo",
          token: "this token wont be validated in test environment",
        },
      },
    });

    expect(resonse.createAuthor.name).toBe("foo");

    const author = await models.Author.findOne({
      where: { name: "foo" },
    });

    const { posts } = await API({
      query: PostsDocument,
      sessionId: author?.id as number,
    });

    expect(posts.count).toBe(1);
  });
});

export {};
