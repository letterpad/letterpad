import { graphql } from "graphql";
import { seed } from "../../seed/seed.js";
import schema from "../../schema";
import constants from "../../utils/constants";
import models from "../../models";

describe("Testing Author Resolvers", () => {
  beforeAll(async () => {
    // console.time = jest.fn();
    return await seed(models, false);
  });

  it("Registers author", async () => {
    const testCase = {
      id: "Register author test case",
      query: `
        mutation register(
          $email: String!
          $username: String!
          $password: String!
        ) {
          register(
            email: $email
            username: $username
            password: $password
          ) {
            ok
            errors {
              path
              message
            }
          }
        }
      `,
      variables: {
        email: "foo@foo.com",
        username: "foo",
        password: "bar",
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
      expected: { data: { register: { ok: true, errors: [] } } },
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

  it("Logs in as author", async () => {
    const testCase = {
      id: "Login author test case",
      query: `
        mutation login(
          $email: String!
          $password: String!
        ) {
          login(
            email: $email
            password: $password
          ) {
            ok
            errors {
              path
              message
            }
          }
        }
      `,
      variables: {
        email: "foo@foo.com",
        password: "bar",
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
      expected: { data: { login: { ok: true, errors: [] } } },
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
});
