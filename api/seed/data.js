require("babel-register");
let Faker = require("faker");

// import _Promise from "bluebird";
import { conn } from "../../config/db.config";
import {
    PostModel,
    PostTaxonomyModel,
    RolePermissionModel,
    RoleAuthorModel,
    RoleModel,
    PermissionModel,
    TaxonomyModel,
    AuthorModel,
    SettingsModel
} from "../models";

// function createRecord(author) {
//     let title = Faker.lorem.sentence();
//     var postTypes = ["post", "page"];
//     return PostModel.create({
//         title: title,
//         body: Faker.lorem.paragraphs(6),
//         author: Faker.name.findName(),
//         excerpt: Faker.lorem.sentences(),
//         cover_image: "http://lorempixel.com/900/300/nature/",
//         type: postTypes[Math.floor(Math.random() * postTypes.length)],
//         status: "draft",
//         slug: title
//             .replace(/[^a-z0-9]+/gi, "-")
//             .replace(/^-*|-*$/g, "")
//             .toLowerCase(),
//         author_id: author.id
//     });
// }
// var createPostTaxonomy = function(taxonomy_id) {
//     return PostTaxonomyModel.create({
//         post_id: Math.round(Math.random() * 10) + 2,
//         taxonomy_id: Math.round(Math.random() * 10) + 2
//     }).catch(() => {
//         return new _Promise((resolve, reject) => {
//             resolve(true);
//         });
//     });
// };
// var taxonomies = ["post_tag", "post_category"];
// var createTaxonomy = function() {
//     return TaxonomyModel.create({
//         name: Faker.lorem.word(),
//         type: taxonomies[Math.floor(Math.random() * taxonomies.length)]
//     });
// };
// var times = 0;
// conn.sync({ force: true }).then(() => {
//     times = 0;
//     var _promiseWhile = _Promise.method(function(condition, action) {
//         if (!condition()) return "oops";
//         return action().then(_promiseWhile.bind(null, condition, action));
//     });
//     var loop = function(n, _create, param1, param2) {
//         return _promiseWhile(
//             function() {
//                 return times < n;
//             },
//             function() {
//                 times++;
//                 return _create(param1, param2);
//             }
//         );
//     };
//     let roles = [
//         { id: 1, name: "ADMIN" },
//         { id: 2, name: "REVIEWER" },
//         { id: 3, name: "READER" },
//         { id: 4, name: "AUTHOR" }
//     ];
//     let permissions = [
//         { id: 1, name: "MANAGE_OWN_POSTS", belongsTo: [4] },
//         { id: 2, name: "READ_ONLY_POSTS", belongsTo: [3] },
//         { id: 3, name: "MANAGE_ALL_POSTS", belongsTo: [2] },
//         { id: 4, name: "MANAGE_USERS", belongsTo: [1] }
//     ];
//     let roles_Promise = roles.map(role => {
//         return RoleModel.create({ name: role.name });
//     });
//     let perm_Promise = permissions.map(permission => {
//         return PermissionModel.create({
//             id: permission.id,
//             name: permission.name
//         });
//     });
//     let rolePerm_Promise = permissions.map((permission, i) => {
//         let relations = permission.belongsTo.map(role_id => {
//             return RolePermissionModel.create({
//                 permission_id: permission.id,
//                 role_id: role_id
//             });
//         });
//     });

//     return AuthorModel.create({
//         username: "Admin",
//         emaill: "redsnow@ajaxtown.com",
//         password: "$2a$10$.dPLmaFVW2jTF/rMcUPRjucno5oKMwVMGeTjrPGDVinSQtPNy9Mdy"
//     })
//         .then(author => {
//             return loop(12, createRecord, author).then(post => {
//                 times = 0;
//                 return loop(30, createTaxonomy).then(taxonomy => {
//                     times = 0;
//                     return loop(60, createPostTaxonomy);
//                 });
//             });
//         })
//         .then(() => {
//             return Promise.all(roles_Promise)
//                 .then(Promise.all(perm_Promise))
//                 .then(Promise.all(rolePerm_Promise))
//                 .then(() => {
//                     return RoleAuthorModel.create({
//                         role_id: 1,
//                         author_id: 1
//                     });
//                 });
//         })
//         .then(() => {
//             let data = [
//                 {
//                     option: "site_title",
//                     value: ""
//                 },
//                 {
//                     option: "site_tagline",
//                     value: ""
//                 },
//                 {
//                     option: "site_email",
//                     value: ""
//                 },
//                 {
//                     option: "site_description",
//                     value: ""
//                 },
//                 {
//                     option: "social_twitter",
//                     value: ""
//                 },
//                 {
//                     option: "social_facebook",
//                     value: ""
//                 },
//                 {
//                     option: "social_instagram",
//                     value: ""
//                 },
//                 {
//                     option: "profile_name",
//                     value: ""
//                 },
//                 {
//                     option: "profile_password",
//                     value: ""
//                 }
//             ];

//             let promises = data.map(record => {
//                 return SettingsModel.create(record);
//             });

//             return Promise.all(promises);
//         })
//         .then(() => {
//             console.log("All data inserted successfully");
//         });
// });
