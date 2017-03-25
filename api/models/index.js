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

conn.sync({ force: false });

export { PostModel, createPost, updatePost } from "./post";
export { TaxonomyModel } from "./taxonomy";
export { AuthorModel } from "./author";
export { PostTaxonomyModel } from "./postTaxonomy";
export { uploadFile } from "./upload";
