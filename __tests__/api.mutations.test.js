import axios from "axios";
import { insertRolePermData, insertSettings } from "../api/seed/seed";
import config from "../config/config.dev";
import models from "../api/models/index.js";

describe("Test Mutations", () => {
  var server;
  var authorization;
  beforeAll(async done => {
    // increase callback async time for requests.
    jest.setTimeout(10000);
    // start the server and preserve the instance.
    // Ideally `beforeEach` should be called instead of `beforeAll`
    // But we are not able to close the server.
    server = require("../api/start");

    // clear the database
    await models.sequelize.sync({ force: true });

    // fill necessary data
    await insertRolePermData(models);
    await insertSettings(models);
    done();
  });

  afterAll(function(done) {
    console.log("Closing server");
    server.close();
    done();
  });

  test("Register Author", async () => {
    console.log("registering author");

    const register = await axios.post(config.apiUrl, {
      query: `mutation {
                register(username:"Sam", email:"sam@gmail.com",password:"iamsam"){
                  data {
                      id
                  }
                  ok
                }
              }`,
    });

    expect(register.data.data.register.ok).toBe(true);
  });

  test("Login with the author", async () => {
    // Login with the created author
    const login = await axios.post(config.apiUrl, {
      query: `mutation {
                        login(email:"sam@gmail.com",password:"iamsam"){
                          ok
                          token
                        }
                      }`,
    });
    const { token, ok } = login.data.data.login;
    authorization = token;
    // result.login = ok;
    // Create a Post
    axios.defaults.headers.common["Authorization"] = token;

    expect(ok).toBe(true);
  });
  test("Create posts", async () => {
    let a = await axios.post(config.apiUrl, {
      headers: {
        Authorization: authorization,
        "Content-Type": "application/json",
      },
      query: `mutation {
                            createPost(type: "post"){
                                ok
                                post {
                                    id
                                    slug
                                }
                                errors{
                                    path
                                    message
                                }
                            }
                        }`,
    });

    expect(a.data.data.createPost.post).toMatchObject({
      id: 1,
      slug: "story",
    });
  });

  test("Update Post", async () => {
    const updatePost = await axios.post(config.apiUrl, {
      headers: {
        Authorization: authorization,
        "Content-Type": "application/json",
      },
      query: `mutation {
                        updatePost(id: 1, title:"new title",body:"new body", taxonomies:[{name:"CatNew", type:"post_Category"}]){
                            ok
                            post {
                                title
                            }
                            errors{
                                path
                                message
                            }
                        }
                  }`,
    });

    expect(updatePost.data.data.updatePost.post).toMatchObject({
      title: "new title",
    });
  });
});
