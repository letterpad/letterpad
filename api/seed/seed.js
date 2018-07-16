import bcrypt from "bcryptjs";
import Faker from "faker";
import rimraf from "rimraf";
import path from "path";
import mkdirp from "mkdirp";
import posts from "./posts";
import { promisify } from "util";
import copydir from "copy-dir";

const mkdirpAsync = promisify(mkdirp);
const rimrafAsync = promisify(rimraf);
const copydirAsync = promisify(copydir);

Faker.locale = "en_US";

// All paths are relative to this file
const dataDir = "../../data";
const publicUploadsDir = "../../public/uploads";
const uploadsSourceDir = "./uploads";

function absPath(p) {
    return path.join(__dirname, p);
}

let models = null;
export const seed = async dbModels => {
    models = dbModels;

    console.time("ensure data directories");
    await Promise.all([
        mkdirpAsync(absPath(dataDir)),
        mkdirpAsync(absPath(publicUploadsDir))
    ]);
    console.timeEnd("ensure data directories");

    console.time("sync sequelize models");
    await models.sequelize.sync({ force: true });
    console.timeEnd("sync sequelize models");

    // do some clean first. delete the uploads folder
    console.time("sync uploads");
    await rimrafAsync(path.join(absPath(publicUploadsDir, "*")));
    await copydirAsync(absPath(uploadsSourceDir), absPath(publicUploadsDir));
    console.timeEnd("sync uploads");

    console.time("insert roles and permissions");
    await insertRolePermData(models);
    console.timeEnd("insert roles and permissions");

    console.time("insert authors and taxonomies");
    await Promise.all([insertAuthor(models), insertTaxonomy(models)]);

    console.timeEnd("insert authors and taxonomies");

    console.time("insert posts, settings, media");
    const [categories, tags] = await Promise.all([
        models.Taxonomy.findAll({
            where: { type: "post_category" }
        }),
        models.Taxonomy.findAll({
            where: { type: "post_tag" }
        })
    ]);

    await Promise.all([
        ...posts.map(post => insertPost(post, models, categories, tags)),
        insertSettings(models),
        insertMedia(models)
    ]);
    console.timeEnd("insert posts, settings, media");
};

export async function insertRolePermData(models) {
    const [
        MANAGE_OWN_POSTS,
        READ_ONLY_POSTS,
        MANAGE_ALL_POSTS,
        MANAGE_USERS,
        MANAGE_SETTINGS
    ] = await Promise.all([
        models.Permission.create({
            name: "MANAGE_OWN_POSTS"
        }),
        models.Permission.create({
            name: "READ_ONLY_POSTS"
        }),
        models.Permission.create({
            name: "MANAGE_ALL_POSTS"
        }),
        models.Permission.create({
            name: "MANAGE_USERS"
        }),
        models.Permission.create({
            name: "MANAGE_SETTINGS"
        })
    ]);

    async function admin() {
        const role = await models.Role.create({ name: "ADMIN" });
        return Promise.all([
            role.addPermission(READ_ONLY_POSTS),
            role.addPermission(MANAGE_ALL_POSTS),
            role.addPermission(MANAGE_USERS),
            role.addPermission(MANAGE_SETTINGS)
        ]);
    }

    async function reviewer() {
        const role = await models.Role.create({ name: "REVIEWER" });
        return role.addPermission(MANAGE_ALL_POSTS);
    }

    async function reader() {
        const role = await models.Role.create({ name: "READER" });
        return role.addPermission(READ_ONLY_POSTS);
    }

    async function author() {
        const role = await models.Role.create({ name: "AUTHOR" });
        return role.addPermission(MANAGE_OWN_POSTS);
    }

    return Promise.all([admin(), reviewer(), reader(), author()]);
}

export async function insertAuthor(models) {
    return models.Author.bulkCreate([
        {
            fname: "John",
            lname: "Dave",
            email: "demo@demo.com",
            password: bcrypt.hashSync("demo", 12),
            social: JSON.stringify({
                twitter: "https://twitter.com",
                facebook: "https://facebook.com",
                github: "https://github.com",
                instagram: "https://instagram.com"
            }),
            role_id: 1,
            bio:
                "Provident quis sed perferendis sed. Sed quo nam eum. Est quos beatae magnam ipsa ut cupiditate nostrum officiis. Vel hic sit voluptatem. Minus minima quis omnis.",
            avatar: "/admin/images/avatar.png"
        },
        {
            fname: "Jim",
            lname: "Parker",
            email: "author@letterpad.app",
            password: bcrypt.hashSync("demo", 12),
            social: JSON.stringify({
                twitter: "https://twitter.com",
                facebook: "https://facebook.com",
                github: "https://github.com",
                instagram: "https://instagram.com"
            }),
            role_id: 1,
            bio:
                "Provident quis sed perferendis sed. Sed quo nam eum. Est quos beatae magnam ipsa ut cupiditate nostrum officiis. Vel hic sit voluptatem. Minus minima quis omnis.",
            avatar: "/admin/images/avatar.png"
        }
    ]);
}

export async function insertTaxonomy(models) {
    return models.Taxonomy.bulkCreate([
        {
            name: "Travel",
            type: "post_category",
            slug: "travel"
        },
        {
            name: "Nature",
            type: "post_category",
            slug: "nature"
        },
        {
            name: "Abstract",
            type: "post_category",
            slug: "abstract"
        },
        {
            name: "sports",
            type: "post_tag",
            slug: "sports"
        },
        {
            name: "nature",
            type: "post_tag",
            slug: "nature"
        },
        {
            name: "street",
            type: "post_tag",
            slug: "street"
        },
        {
            name: "forest",
            type: "post_tag",
            slug: "forest"
        },
        {
            name: "sky",
            type: "post_tag",
            slug: "sky"
        }
    ]);
}

export async function insertPost(params, models, categories, tags) {
    // get author  // 1 or 2
    const randomAuthorId = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
    let admin = await models.Author.findOne({ where: { id: randomAuthorId } });
    const slug = params.title.toLocaleLowerCase().replace(/ /g, "-");
    let post = await models.Post.create({
        title: params.title,
        body: Faker.lorem.paragraphs(6),
        excerpt: Faker.lorem.sentences(3),
        cover_image: params.cover_image,
        author_id: randomAuthorId,
        type: params.type,
        status: params.status,
        slug: slug,
        mode: "rich-text",
    });

    const randomCategory = Math.floor(Math.random() * (2 - 1 + 1)) + 1;

    return Promise.all([
        admin.addPost(post),
        post.addTaxonomy(categories[randomCategory]),
        ...tags.map(tag => post.addTaxonomy(tag))
    ]);
}

export async function insertMedia(models) {
    return models.Media.bulkCreate([
        {
            url: "/uploads/1.jpg",
            author_id: 1,
            name: Faker.lorem.words(2),
            description: Faker.lorem.sentences(2)
        },
        {
            url: "/uploads/2.jpg",
            author_id: 1,
            name: Faker.lorem.words(2),
            description: Faker.lorem.sentences(2)
        },
        {
            url: "/uploads/3.jpg",
            author_id: 1,
            name: Faker.lorem.words(2),
            description: Faker.lorem.sentences(2)
        },
        {
            url: "/uploads/4.jpg",
            author_id: 1,
            name: Faker.lorem.words(2),
            description: Faker.lorem.sentences(2)
        },
        {
            url: "/uploads/5.jpg",
            author_id: 1,
            name: Faker.lorem.words(2),
            description: Faker.lorem.sentences(2)
        },
        {
            url: "/uploads/6.jpg",
            author_id: 1,
            name: Faker.lorem.words(2),
            description: Faker.lorem.sentences(2)
        },
        {
            url: "/uploads/7.jpg",
            author_id: 1,
            name: Faker.lorem.words(2),
            description: Faker.lorem.sentences(2)
        },
        {
            url: "/uploads/8.jpg",
            author_id: 1,
            name: Faker.lorem.words(2),
            description: Faker.lorem.sentences(2)
        },
        {
            url: "/uploads/9.jpg",
            author_id: 1,
            name: Faker.lorem.words(2),
            description: Faker.lorem.sentences(2)
        },
        {
            url: "/uploads/10.jpg",
            author_id: 1,
            name: Faker.lorem.words(2),
            description: Faker.lorem.sentences(2)
        },
        {
            url: "/uploads/11.jpg",
            author_id: 1,
            name: Faker.lorem.words(2),
            description: Faker.lorem.sentences(2)
        },
        {
            url: "/uploads/12.jpg",
            author_id: 1,
            name: Faker.lorem.words(2),
            description: Faker.lorem.sentences(2)
        }
    ]);
}

export async function insertSettings(models) {
    let menu = JSON.stringify([
        {
            id: 3,
            title: "Abstract",
            type: "category",
            name: "Home",
            disabled: true,
            slug: "home"
        },
        {
            id: 1,
            title: "Travel",
            type: "category",
            name: "Travel",
            disabled: true,
            slug: "travel"
        },
        {
            id: 11,
            title: "Page 2",
            slug: "about",
            type: "page",
            name: "About",
            disabled: true
        }
    ]);

    let data = [
        {
            option: "site_title",
            value: "Letterpad"
        },
        {
            option: "site_tagline",
            value: "Compose a story"
        },
        {
            option: "site_email",
            value: "admin@letterpad.app"
        },
        {
            option: "site_url",
            value: "https://letterpad.app/demo"
        },
        {
            option: "site_footer",
            value: ""
        },
        {
            option: "site_description",
            value: ""
        },
        {
            option: "social_twitter",
            value: "https://twitter.com"
        },
        {
            option: "social_facebook",
            value: "https://facebook.com"
        },
        {
            option: "social_instagram",
            value: "https://instagram.com"
        },
        {
            option: "social_github",
            value: "https://www.github.com"
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
            option: "displayAuthorInfo",
            value: true
        },
        {
            option: "site_logo",
            value: "/uploads/logo.png"
        },
        {
            option: "menu",
            value: menu
        },
        {
            option: "css",
            value: ""
        },
        {
            option: "google_analytics",
            value: ""
        },
        {
            option: "locale",
            value: JSON.stringify({ en: true, fr: false, pl: false })
        },
        {
            option: "theme",
            value: "hugo"
        },
        {
            option: "disqus_id",
            value: "letterpad"
        },
        {
            option: "banner",
            value: "/uploads/banner.jpg"
        },
        {
            option: "editor",
            value: "richtext"
        }
    ];

    return models.Setting.bulkCreate(data);
}
