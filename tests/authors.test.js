import fetch from "isomorphic-fetch";
import axios from "axios";
import { conn } from "../api/models";
import { insertRolePermData } from "../api/seed/seed";

const server = "http://localhost:3030/graphql";

// beforeAll(async () => {
//     await conn.sync({ force: true });
//     await insertRolePermData();
// });

describe("Author Resolvers", () => {
    //  jest.setTestTimeout(10000);
    // This tests a successful request for the name of person 1
    test("Register Author", async () => {
        await conn.sync({ force: true });
        await insertRolePermData();
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
        result.register = register.data.data.register.ok;

        // Login the author

        const login = await axios.post(server, {
            query: `mutation {
                login(email:"sam@gmail.com",password:"iamsam"){
                  ok
                  token
                }
              }`
        });
        const { token, ok } = login.data.data.login;

        result.login = ok;
        // Create a Post
        axios.defaults.headers.common["Authorization"] = token;

        expect(result).toMatchObject({
            register: true,
            login: true
        });
    });

    test("Create/Update posts", async () => {
        const result = {};
        try {
            var q = {
                query: `mutation {
                createPost(title:"hello bad world",body:"b", type: "post", taxonomies:[{name:"CatNew", type:"post_Category"}]){
                    ok
                    post {
                        id
                    }
                    errors{
                        path
                        message
                    }
                }
          }`
            };
            let a = await fetch("http://localhost:3030/graphql", {
                method: "post",
                headers: {
                    Authorization:
                        axios.defaults.headers.common["Authorization"],
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(q)
            });
            console.log(a);
            expect(1).toBe(1);
            // const createPost = await axios.post(server, {
            //     query: `mutation {
            //         createPost(title:"hello bad world",body:"b", taxonomies:[{name:"CatNew", type:"post_Category"}]){
            //             ok
            //             post {
            //                 slug
            //             }
            //             errors{
            //                 path
            //                 message
            //             }
            //         }
            //   }`
            // });
            // result.createPost = createPost.data.data.createPost.post.slug;

            // const updatePost = await axios.post(server, {
            //     query: `mutation {
            //         updatePost(id: 1, title:"new title",body:"new body", taxonomies:[{name:"CatNew", type:"post_Category"}]){
            //             ok
            //             post {
            //                 title
            //             }
            //             errors{
            //                 path
            //                 message
            //             }
            //         }
            //   }`
            // });
            // result.updatePost = updatePost.data.data.updatePost.post.title;
        } catch (e) {
            console.log(e);
        }
        expect(result).toMatchObject({
            createPost: "hello-bad-world",
            updatePost: "new title"
        });
    });
});
