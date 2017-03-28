import { PostModel, createPost, updatePost } from "./post";
import { TaxonomyModel } from "./taxonomy";
import { RoleModel } from "./role";
import { PermissionModel } from "./permission";
import { AuthorModel } from "./author";
import { PostTaxonomyModel } from "./postTaxonomy";
import { RolePermissionModel } from "./rolePermission";
import { RoleAuthorModel } from "./roleAuthor";
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

RoleModel.belongsToMany(PermissionModel, {
    through: RolePermissionModel,
    as: "permission"
});

PermissionModel.belongsToMany(RoleModel, {
    through: RolePermissionModel,
    as: "role"
});
RoleModel.belongsToMany(AuthorModel, {
    through: RoleAuthorModel,
    as: "author"
});
AuthorModel.belongsToMany(RoleModel, {
    through: RoleAuthorModel,
    as: "role"
});

conn.sync({ force: true });

export { PostModel, createPost, updatePost } from "./post";
export { TaxonomyModel } from "./taxonomy";
export { AuthorModel } from "./author";
export { RoleModel } from "./role";
export { PermissionModel } from "./permission";
export { RolePermissionModel } from "./rolePermission";
export { RoleAuthorModel } from "./roleAuthor";
export { PostTaxonomyModel } from "./postTaxonomy";
export { uploadFile } from "./upload";
export { SettingsModel, updateOptions } from "./settings";
