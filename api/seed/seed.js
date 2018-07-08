import bcrypt from "bcryptjs";
import Faker from "faker";
import rimraf from "rimraf";
import path from "path";
import mkdirp from "mkdirp";

const copydir = require("copy-dir");
Faker.locale = "en_US";

let models = null;
export const seed = async dbModels => {
    models = dbModels;

    mkdirp.sync(path.join(__dirname, "../../data"));
    mkdirp.sync(path.join(__dirname, "../../public/uploads"));

    await models.sequelize.sync({ force: true });
    // do some clean first. delete the uploads folder
    rimraf(__dirname + "/../../public/uploads/*", () => {
        copydir.sync(
            __dirname + "/uploads",
            __dirname + "/../../public/uploads"
        );
    });

    await insertRolePermData(models);
    await insertAuthor(models);
    await insertTaxonomy(models);
    await insertPost(
        {
            title: "We encountered a new paradise",
            type: "post",
            status: "publish",
            cover_image: "/uploads/1.jpg"
        },
        models
    );
    await insertPost(
        {
            title: "The Mountain",
            type: "post",
            status: "publish",
            cover_image: "/uploads/2.jpg"
        },
        models
    );
    await insertPost(
        {
            title: "Ink in water",
            type: "post",
            status: "publish",
            cover_image: "/uploads/3.jpg"
        },
        models
    );
    await insertPost(
        {
            title: "Future of ReactJS",
            type: "post",
            status: "publish",
            cover_image: "/uploads/4.jpg"
        },
        models
    );
    await insertPost(
        {
            title: "A bright sunny day",
            type: "post",
            status: "publish",
            cover_image: "/uploads/5.jpg"
        },
        models
    );
    await insertPost(
        {
            title: "Post 6",
            type: "post",
            status: "publish",
            cover_image: "/uploads/6.jpg"
        },
        models
    );
    await insertPost(
        {
            title: "Post 7",
            type: "post",
            status: "publish",
            cover_image: "/uploads/7.jpg"
        },
        models
    );
    await insertPost(
        {
            title: "Post 8",
            type: "post",
            status: "publish",
            cover_image: "/uploads/8.jpg"
        },
        models
    );
    await insertPost(
        {
            title: "Post 9",
            type: "post",
            status: "publish",
            cover_image: "/uploads/9.jpg"
        },
        models
    );
    await insertPost(
        {
            title: "Post 10",
            type: "post",
            status: "publish",
            cover_image: "/uploads/10.jpg"
        },
        models
    );
    await insertPost(
        {
            title: "Post 11",
            type: "post",
            status: "publish",
            cover_image: "/uploads/11.jpg"
        },
        models
    );
    await insertPost(
        {
            title: "Post 12",
            type: "post",
            status: "publish",
            cover_image: "/uploads/12.jpg"
        },
        models
    );
    await insertPost(
        {
            title: "Post 13",
            type: "post",
            status: "publish",
            cover_image: "/uploads/1.jpg"
        },
        models
    );
    await insertPost(
        {
            title: "Post 14",
            type: "post",
            status: "publish",
            cover_image: "/uploads/2.jpg"
        },
        models
    );
    await insertPost(
        {
            title: "Post 15",
            type: "post",
            status: "publish",
            cover_image: "/uploads/3.jpg"
        },
        models
    );
    await insertPost(
        {
            title: "Post 16",
            type: "post",
            status: "publish",
            cover_image: "/uploads/4.jpg"
        },
        models
    );
    await insertPost(
        {
            title: "Post 17",
            type: "post",
            status: "publish",
            cover_image: "/uploads/5.jpg"
        },
        models
    );
    await insertPost(
        {
            title: "About",
            type: "page",
            status: "publish",
            cover_image: "/uploads/6.jpg"
        },
        models
    );
    await insertPost(
        {
            title: "Page 3 (draft)",
            type: "page",
            status: "draft"
        },
        models
    );
    await insertSettings(models);
    await insertMedia(models);
};

export async function insertRolePermData(models) {
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

export async function insertAuthor(models) {
    await models.Author.bulkCreate([
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
    await models.Taxonomy.bulkCreate([
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
        }
    ]);
    await models.Taxonomy.bulkCreate([
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

export async function insertPost(params, models) {
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
        mdPreview: ""
    });
    await admin.addPost(post);

    let categories = await models.Taxonomy.findAll({
        where: { type: "post_category" }
    });

    let tags = await models.Taxonomy.findAll({
        where: { type: "post_tag" }
    });

    let postItem = await models.Post.findOne({
        limit: 1,
        order: [["id", "DESC"]]
    });
    const randomCategory = Math.floor(Math.random() * (2 - 1 + 1)) + 1;

    await postItem.addTaxonomy(categories[randomCategory]);

    tags.forEach(async tag => {
        await postItem.addTaxonomy(tag);
    });
}

export async function insertMedia(models) {
    await models.Media.bulkCreate([
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
        }
    ];
    await models.Setting.bulkCreate(data);
}
