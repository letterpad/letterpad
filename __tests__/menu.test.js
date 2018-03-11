import fetch from "isomorphic-fetch";
import axios from "axios";
import { conn } from "../api/models";
import {
    insertRolePermData,
    insertAuthor,
    insertTaxonomy,
    insertPost,
    insertSettings
} from "../api/seed/seed";
import config from "../config/config.dev";

const server = config.apiUrl;

let authorization = "";
describe("Test menu", () => {
    beforeAll(async done => {
        jest.setTimeout(15000);
        await conn.sync({ force: true });
        await insertRolePermData();
        await insertAuthor();
        await insertTaxonomy();
        await insertPost({ title: "Post 1", type: "post", status: "publish" });
        await insertPost({ title: "Post 2", type: "page", status: "publish" });
        await insertSettings();
        done();
    });

    test("Test custom category slug", async () => {
        const q = await axios.post(server, {
            query: `query {
                postsMenu(slug:"custom-slug",postType:"post"){ 
                  posts {
                      id
                  }
                }
              }`
        });
        expect(q.data.data.postsMenu.posts[0].id).toBe(1);
    });

    test("Test category slug", async () => {
        const q = await axios.post(server, {
            query: `query {
                postsMenu(slug:"un-categorized", type:"post_category", postType:"post"){
                  posts {
                      id
                  }
                }
              }`
        });

        expect(q.data.data.postsMenu.posts[0].id).toBe(1);
    });

    test("Test invalid category slug", async () => {
        const q = await axios.post(server, {
            query: `query {
                postsMenu(slug:"invalid-slug", type:"post_category",postType:"post"){
                  posts {
                      id
                  }
                }
              }`
        });
        expect(q.data.data.postsMenu.posts.length).toBe(0);
    });

    test("Test valid page slug", async () => {
        const slug = await axios.post(server, {
            query: `query {
                post(id:2){
                  slug
                }
              }`
        });
        const q = await axios.post(server, {
            query: `query {
                pageMenu(slug:"${slug.data.data.post.slug}",postType:"page"){
                  post {
                      id
                  }
                }
              }`
        });
        expect(q.data.data.pageMenu.post.id).toBe(2);
    });
});
