import fetch from "isomorphic-fetch";
import axios from "axios";
import { conn } from "../api/models";
import config from "../config/config.dev";
import { insertRolePermData } from "../api/seed/seed";

const server = config.apiUrl;

let authorization = "";
describe("Author Resolvers", () => {
    beforeAll(async done => {
        jest.setTimeout(15000);
        await conn.sync({ force: true });
        await insertRolePermData();
        done();
    });

    test("Register Author", async () => {
        console.log("registering author");
        const result = {};
        const register = await axios.post(server, {
            query: `mutation {
                register(username:"Sam", email:"sam@gmail.com",password:"iamsam"){
                  data {
                      id
                  }
                  ok
                }
              }`
        });
        expect(register.data.data.register.ok).toBe(true);
    });

    test("Login with the author", async () => {
        // Login with the created author
        const login = await axios.post(server, {
            query: `mutation {
                login(email:"sam@gmail.com",password:"iamsam"){
                  ok
                  token
                }
              }`
        });
        const { token, ok } = login.data.data.login;
        authorization = token;
        // result.login = ok;
        // Create a Post
        axios.defaults.headers.common["Authorization"] = token;

        expect(ok).toBe(true);
    });
    test("Create posts", async () => {
        let a = await axios.post(server, {
            headers: {
                Authorization: authorization,
                "Content-Type": "application/json"
            },
            query: `mutation {
                    createPost(title:"hello bad world",body:"b", type: "post", taxonomies:[{name:"CatNew", type:"post_Category"}]){
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
                }`
        });

        expect(a.data.data.createPost.post).toMatchObject({
            id: 1,
            slug: "hello-bad-world"
        });
    });

    test("Update Post", async () => {
        const updatePost = await axios.post(server, {
            headers: {
                Authorization: authorization,
                "Content-Type": "application/json"
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
          }`
        });

        expect(updatePost.data.data.updatePost.post).toMatchObject({
            title: "new title"
        });
    });
});
