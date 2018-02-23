import { conn } from "../../config/mysql.config";
import Sequalize, { DataTypes } from "sequelize";
import bcrypt from "bcryptjs";
import Faker from "faker";
import rimraf from "rimraf";
const copydir = require("copy-dir");

const models = {
    Author: conn.import("../models/author"),
    Post: conn.import("../models/post"),
    Taxonomy: conn.import("../models/taxonomy"),
    Role: conn.import("../models/role"),
    Permission: conn.import("../models/permission"),
    Setting: conn.import("../models/settings"),
    Media: conn.import("../models/media")
};

Object.keys(models).map(name => {
    if ("associate" in models[name]) {
        models[name].associate(models);
    }
});
models.Sequalize = Sequalize;
models.conn = conn;

export const seed = async () => {
    await models.conn.sync({ force: true });

    // do some clean first. delete the uploads folder
    rimraf(__dirname + "/../../public/uploads/*", () => {
        copydir.sync(
            __dirname + "/uploads",
            __dirname + "/../../public/uploads"
        );
    });
    await insertRolePermData();
    await insertAuthor();
    await insertTaxonomy();
    await insertPost({ title: "Post 1", type: "post", status: "publish" });
    await insertPost({ title: "Post 2", type: "post", status: "publish" });
    await insertPost({ title: "Post 3", type: "post", status: "publish" });
    await insertPost({ title: "Post 4", type: "post", status: "publish" });
    await insertPost({ title: "Post 5", type: "post", status: "publish" });
    await insertPost({ title: "Post 6", type: "post", status: "publish" });
    await insertPost({ title: "Post 7", type: "post", status: "publish" });
    await insertPost({ title: "Post 8", type: "post", status: "publish" });
    await insertPost({ title: "Post 9-draft", type: "post", status: "draft" });
    await insertPost({ title: "Post 10-draft", type: "post", status: "draft" });

    await insertPost({ title: "Page 1", type: "page", status: "publish" });
    await insertPost({ title: "Page 2", type: "page", status: "publish" });
    await insertPost({
        title: "Page 3 (draft)",
        type: "page",
        status: "draft"
    });
    await insertSettings();
};

export async function insertRolePermData() {
    let MANAGE_OWN_POSTS = await models.Permission.create({
        name: "MANAGE_OWN_POSTS"
    });
    let READ_ONLY_POSTS = await models.Permission.create({
        name: "READ_ONLY_POSTS"
    });
    let MANAGE_ALL_POSTS = await models.Permission.create({
        name: "MANAGE_ALL_POSTS"
    });
    let MANAGE_USERS = await models.Permission.create({
        name: "MANAGE_USERS"
    });
    let MANAGE_SETTINGS = await models.Permission.create({
        name: "MANAGE_SETTINGS"
    });

    let role = await models.Role.create({ name: "ADMIN" });
    await role.addPermission(MANAGE_OWN_POSTS);
    await role.addPermission(READ_ONLY_POSTS);
    await role.addPermission(MANAGE_ALL_POSTS);
    await role.addPermission(MANAGE_USERS);
    await role.addPermission(MANAGE_SETTINGS);

    role = await models.Role.create({ name: "REVIEWER" });
    await role.addPermission(MANAGE_ALL_POSTS);

    role = await models.Role.create({ name: "READER" });
    await role.addPermission(READ_ONLY_POSTS);

    role = await models.Role.create({ name: "AUTHOR" });
    await role.addPermission(MANAGE_OWN_POSTS);
}

export async function insertAuthor() {
    await models.Author.bulkCreate([
        {
            fname: "John",
            lname: "Dave",
            email: "admin@razor.com",
            password: bcrypt.hashSync("password", 12),
            social: JSON.stringify({
                twitter: "",
                facebook: "",
                github: "",
                instagram: ""
            }),
            role_id: 1
        },
        {
            fname: "Jim",
            lname: "Parker",
            email: "author@razor.com",
            password: bcrypt.hashSync("password", 12),
            social: JSON.stringify({
                twitter: "",
                facebook: "",
                github: "",
                instagram: ""
            }),
            role_id: 1
        }
    ]);
}
export async function insertTaxonomy() {
    await models.Taxonomy.bulkCreate([
        {
            name: "Uncategorized",
            type: "post_category",
            slug: "un-categorized"
        },
        {
            name: "General",
            type: "post_category",
            slug: "gen"
        }
    ]);
    await models.Taxonomy.bulkCreate([
        {
            name: "tag1",
            type: "post_tag",
            slug: "tag-1"
        },
        {
            name: "tag2",
            type: "post_tag",
            slug: "tag-2"
        },
        {
            name: "tag3",
            type: "post_tag",
            slug: "tag-3"
        },
        {
            name: "tag4",
            type: "post_tag",
            slug: "tag-4"
        },
        {
            name: "tag5",
            type: "post_tag",
            slug: "tag-5"
        }
    ]);
}

export async function insertPost(params) {
    // get author
    let admin = await models.Author.findOne({ where: { role_id: 1 } });
    const title = Faker.lorem.words(3);
    const slug = title.toLocaleLowerCase().replace(/ /g, "-");
    const imageNo = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
    let post = await models.Post.create({
        title: params.title,
        body: Faker.lorem.paragraphs(6),
        excerpt: Faker.lorem.sentences(),
        cover_image: "/uploads/" + imageNo + ".jpeg",
        type: params.type,
        status: params.status,
        slug: slug,
        author_id: admin.id
    });
    await admin.addPost(post);

    let taxonomy = await models.Taxonomy.findOne({
        where: { type: "post_category" }
    });
    let postItem = await models.Post.findOne({
        limit: 1,
        order: [["id", "DESC"]]
    });
    await postItem.addTaxonomy(taxonomy);
}

export async function insertSettings() {
    let menu = JSON.stringify([
        {
            id: "1-category",
            label: "Uncategorized",
            type: "category",
            name: "Home",
            children: [],
            slug: "un-categorized"
        },
        {
            id: "2-category",
            label: "General",
            type: "category",
            name: "Empty",
            children: [],
            slug: "gen"
        },
        {
            id: "12-page",
            label: "Page 2",
            slug: "error-quasi-iste",
            type: "page",
            name: "About Me",
            children: []
        },
        {
            id: "1519412227282-label",
            label: "Label",
            type: "label",
            name: "Folder",
            children: [
                {
                    id: "1519412236064-label",
                    label: "Label",
                    type: "label",
                    name: "Sub Folder",
                    children: [
                        {
                            id: "11-page",
                            label: "Page 1",
                            slug: "dignissimos-est-consequatur",
                            type: "page",
                            name: "Page 1",
                            disabled: true,
                            children: []
                        }
                    ]
                }
            ]
        }
    ]);
    let data = [
        {
            option: "site_title",
            value: "Letterpad"
        },
        {
            option: "site_tagline",
            value: "Minimalism is beautiful"
        },
        {
            option: "site_email",
            value: ""
        },
        {
            option: "site_description",
            value: ""
        },
        {
            option: "social_twitter",
            value: ""
        },
        {
            option: "social_facebook",
            value: ""
        },
        {
            option: "social_instagram",
            value: ""
        },
        {
            option: "text_notfound",
            value: "Sorry, we went deep inside, but found nothing"
        },
        {
            option: "text_posts_empty",
            value: "Sorry, we couldn't find any posts"
        },
        {
            option: "sidebar_latest_post_count",
            value: 3
        },
        {
            option: "sidebar_about",
            value:
                "You can fill up this space by writing a short bio about yourself or about your site.."
        },
        {
            option: "menu",
            value: menu
        }
    ];
    await models.Setting.bulkCreate(data);
}

if (require.main === module) {
    seed();
}
