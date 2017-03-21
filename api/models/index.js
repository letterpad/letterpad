import { PostModel, createPost, updatePost } from "./post";
import { TaxonomyModel } from "./taxonomy";
import { AuthorModel } from "./author";
import { PostTaxonomyModel } from "./postTaxonomy";

import { conn } from "../../config/mysql.config";

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
function createRecord() {
    return AuthorModel
        .create({
            username: "Admin",
            emaill: "redsnow@ajaxtown.com",
            password: "$2a$10$.dPLmaFVW2jTF/rMcUPRjucno5oKMwVMGeTjrPGDVinSQtPNy9Mdy"
        })
        .then(author => {
            PostModel
                .create({
                    title: "John",
                    body: "body",
                    author: "Hancock",
                    excerpt: "exceprt",
                    cover_image: "../../",
                    type: "page",
                    status: "draft",
                    permalink: "/..//./permalink",
                    author_id: author.id
                })
                .then(post => {
                    return TaxonomyModel
                        .create({
                            name: "Uncategorized",
                            type: "post_category"
                        })
                        .then(taxonomy => {
                            return PostTaxonomyModel.create({
                                post_id: post.id,
                                taxonomy_id: taxonomy.id
                            });
                        })
                        .then(() => {
                            return TaxonomyModel
                                .create({
                                    name: "Categorized",
                                    type: "post_category"
                                })
                                .then(taxonomy => {
                                    return PostTaxonomyModel.create({
                                        post_id: post.id,
                                        taxonomy_id: taxonomy.id
                                    });
                                });
                        });
                });
        });
}
conn.sync({ force: false }).then(() => {
    //return createRecord();
});

export { PostModel, createPost, updatePost } from "./post";
export { TaxonomyModel } from "./taxonomy";
export { AuthorModel } from "./author";
export { PostTaxonomyModel } from "./postTaxonomy";
export { uploadFile } from "./upload";
