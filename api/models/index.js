import { PostModel, createPost, updatePost } from "./post";
import { TaxonomyModel } from "./taxonomy";
import { AuthorModel } from "./author";
import { PostTaxonomyModel } from "./postTaxonomy";

import { conn } from "../../config/mysql.config";
let Faker = require("faker");
import Promise from "bluebird";
PostModel.belongsToMany(TaxonomyModel, {
    through: PostTaxonomyModel,
    as: "taxonomy"
});
TaxonomyModel.belongsToMany(PostModel, {
    through: PostTaxonomyModel,
    as: "post"
});

AuthorModel.hasMany(PostModel);
PostModel.belongsTo(AuthorModel);

function createRecord(author) {
    let title = Faker.lorem.sentence();
    return PostModel.create({
        title: title,
        body: Faker.lorem.paragraphs(),
        author: Faker.name.findName(),
        excerpt: Faker.lorem.sentences(),
        cover_image: Faker.image.abstract(),
        type: "page",
        status: "draft",
        permalink: title
            .replace(/[^a-z0-9]+/gi, "-")
            .replace(/^-*|-*$/g, "")
            .toLowerCase(),
        author_id: author.id
    });
}
let post_id = 1;
var createPostTaxonomy = function(taxonomy_id) {
    return PostTaxonomyModel.create({
        post_id: post_id++,
        taxonomy_id: taxonomy_id
    });
};
var times = 0;
conn.sync({ force: false }).then(() => {
    times = 0;

    var promiseWhile = Promise.method(function(condition, action) {
        if (!condition()) return "oops";
        return action().then(promiseWhile.bind(null, condition, action));
    });

    var loop = function(n, create, param1, param2) {
        return promiseWhile(
            function() {
                return times < n;
            },
            function() {
                debugger;

                times++;
                return create(param1, param2);
            }
        );
    };
    // return AuthorModel
    //     .create({
    //         username: "Admin",
    //         emaill: "redsnow@ajaxtown.com",
    //         password: "$2a$10$.dPLmaFVW2jTF/rMcUPRjucno5oKMwVMGeTjrPGDVinSQtPNy9Mdy"
    //     })
    //     .then(author => {
    //         return loop(12, createRecord, author).then(post => {
    //             return TaxonomyModel
    //                 .create({
    //                     name: "Categorized",
    //                     type: "post_category"
    //                 })
    //                 .then(taxonomy => {
    //                     times = 0;
    //                     return loop(12, createPostTaxonomy, taxonomy.id);
    //                 });
    //         });
    //     });
});

export { PostModel, createPost, updatePost } from "./post";
export { TaxonomyModel } from "./taxonomy";
export { AuthorModel } from "./author";
export { PostTaxonomyModel } from "./postTaxonomy";
export { uploadFile } from "./upload";
