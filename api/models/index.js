import TaxonomyModel from "./taxonomy";
import PostModel, { createPost, updatePost } from "./post";
import RoleModel from "./role";
import PermissionModel from "./permission";
import AuthorModel from "./author";
import MediaModel from "./media";
import PostTaxonomyModel from "./postTaxonomy";
import RolePermissionModel from "./rolePermission";
import RoleAuthorModel from "./roleAuthor";
import conn from "../../config/db.config";

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

// RoleModel.belongsToMany(AuthorModel, {
//     through: RoleAuthorModel,
//     as: "author"
// });
RoleModel.hasMany(AuthorModel);

AuthorModel.belongsTo(RoleModel);

conn.sync({ force: false });

export { PostModel, _createPost, _updatePost } from "./post";
export { TaxonomyModel } from "./taxonomy";
export { AuthorModel } from "./author";
export { RoleModel } from "./role";
export { PermissionModel } from "./permission";
export { RolePermissionModel } from "./rolePermission";
export { RoleAuthorModel } from "./roleAuthor";
export { PostTaxonomyModel } from "./postTaxonomy";
export { uploadFile } from "./upload";
export { SettingsModel, updateOptions } from "./settings";
export { MediaModel } from "./media";
