import { prisma } from "@/lib/prisma";

import { API } from "@/../tests/testClient";
import {
  CreateAuthorDocument,
  LoginDocument,
} from "@/__generated__/src/graphql/queries/mutations.graphql";
import { PostsDocument } from "@/__generated__/src/graphql/queries/queries.graphql";

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
          username: "foo",
          setting: {
            site_title: "register site title",
          },
          token: "this token wont be validated in test environment",
        },
      },
    });

    expect(resonse.createAuthor.name).toBe("foo");

    const author = await prisma.author.findFirst({
      where: { name: "foo" },
    });

    const { posts } = await API({
      query: PostsDocument,
      sessionId: author?.id as number,
    });

    expect(posts.count).toBe(3);
  });
});

export {};
