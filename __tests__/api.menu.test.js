import axios from "axios";
import { conn, Setting, Post, Taxonomy } from "../api/models";
import {
    insertRolePermData,
    insertAuthor,
    insertTaxonomy,
    insertPost
} from "../api/seed/seed";
import config from "../config/config.dev";

describe("Test menu", () => {
    var server;

    beforeAll(async done => {
        // increase callback async time for requests.
        jest.setTimeout(10000);
        // set the environment to test
        process.env = { ...process.env, NODE_ENV: "test" };
        // start the server and preserve the instance.
        // Ideally `beforeEach` should be called instead of `beforeAll`
        // But we are not able to close the server.
        server = require("../api/startDev");

        // clear the database
        await conn.sync({ force: true });

        // fill necessary data
        await insertRolePermData();
        await insertAuthor();
        await insertTaxonomy();
        await insertPost({ title: "Post 1", type: "post", status: "publish" });
        await insertPost({ title: "Post 2", type: "page", status: "publish" });
        done();
    });

    afterAll(function(done) {
        console.log("Closing server");
        server.close(done);
    });

    test("Test custom category slug", async () => {
        // Create a category. This category will have a default slug.
        // It will be used in the navigation menu as an item.
        // In this item, the default slug of the category can be modiied.

        // On clicking this item, the related posts will be displayed.
        // We want to check if the modified slug can render the same posts.

        // First create the category
        const category = await Taxonomy.create({
            name: "Category",
            type: "post_category",
            slug: "category" // default slug
        });
        // get the category id
        const category_id = category.id;

        // get a post
        const post = await Post.findOne({ where: { id: 1 } });
        // add the cateogry to a post
        post.addTaxonomy(category);

        // create a menu with custom slug with the above category
        await Setting.create({
            option: "menu",
            value: JSON.stringify([
                {
                    id: category_id,
                    title: "Category",
                    type: "category",
                    name: "Category",
                    slug: "custom-slug" // modified slug
                }
            ])
        });
        // send the request witht eh custom slug and check if you got the relevant post
        const q = await axios.post(config.apiUrl, {
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
        // Create a category. This category will have a default slug.
        // It will be used in the navigation menu as an item.
        // In this item, the default slug of the category can be modiied.

        // On clicking this item, the related posts will be displayed.
        // We are verifying this here.

        // First create the category
        const category = await Taxonomy.create({
            name: "Category",
            type: "post_category",
            slug: "category" // default slug
        });
        // get the category id
        const category_id = category.id;

        // get a post
        const post = await Post.findOne({ where: { id: 1 } });
        // add the cateogry to a post
        post.addTaxonomy(category);

        // create a menu with custom slug with the above category
        await Setting.create({
            option: "menu",
            value: JSON.stringify([
                {
                    id: category_id,
                    title: "Category",
                    type: "category",
                    name: "Category",
                    slug: "category" // unmodified (default slug)
                }
            ])
        });
        // send the request
        const q = await axios.post(config.apiUrl, {
            query: `query {
            postsMenu(slug:"category", type:"post_category", postType:"post"){
              posts {
                  id
              }
            }
          }`
        });
        expect(q.data.data.postsMenu.posts[0].id).toBe(1);
    });

    test("Test invalid category slug", async () => {
        const q = await axios.post(config.apiUrl, {
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
        const slug = await axios.post(config.apiUrl, {
            query: `query {
                post(id:2){
                  slug
                }
              }`
        });
        const q = await axios.post(config.apiUrl, {
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
