import { conn } from "../../config/mysql.config";
import Sequalize from "sequelize";

// const conn = new Sequalize("reactcms", "root", "123456", {
//     host: "localhost",
//     dialect: "mysql",
//     define: {
//         underscored: true
//     },
//     pool: {
//         max: 5,
//         min: 0,
//         idle: 10000
//     }
// });

var Post = conn.define(
    "posts1",
    {
        title: {
            type: Sequalize.STRING
        },
        body: {
            type: Sequalize.STRING
        },
        excerpt: {
            type: Sequalize.STRING
        },
        cover_image: {
            type: Sequalize.STRING
        },
        type: {
            type: Sequalize.STRING
        },
        status: {
            type: Sequalize.STRING
        },
        slug: {
            type: Sequalize.STRING
        }
    },
    {
        freezeTableName: true // Model tableName will be the same as the model name
    }
);

var Taxonomies = conn.define(
    "taxonomies1",
    {
        name: {
            type: Sequalize.STRING
        },
        type: {
            type: Sequalize.STRING
        }
    },
    {
        freezeTableName: true // Model tableName will be the same as the model name
    }
);

var PostTaxonomyRelationship = conn.define(
    "post_taxonomy_relation1",
    {
        post_id: {
            type: Sequalize.INTEGER
        },
        taxonomy_id: {
            type: Sequalize.INTEGER
        }
    },
    {
        freezeTableName: true // Model tableName will be the same as the model name
    }
);

var Authors = conn.define(
    "authors",
    {
        username: {
            type: Sequalize.STRING
        },
        password: {
            type: Sequalize.STRING
        },
        email: {
            type: Sequalize.STRING
        }
    },
    {
        freezeTableName: true
    }
);
// Post.hasMany(Taxonomies, {joinTableName: 'post_taxonomy_relation1'});
// Taxonomies.belongsTo(Post, {joinTableName: 'post_taxonomy_relation1'});

// Post.hasMany(PostTaxonomyRelationship, { foreignKey: "post_id" });
// Taxonomies.hasMany(PostTaxonomyRelationship, { foreignKey: "taxonomy_id" });
Post.belongsToMany(Taxonomies, {
    through: PostTaxonomyRelationship,
    as: "taxonomy"
});
Taxonomies.belongsToMany(Post, {
    through: PostTaxonomyRelationship,
    as: "post"
});

Authors.hasMany(Post);
Post.belongsTo(Authors);

function createRecord() {
    return Authors.create({
        username: "Admin",
        emaill: "redsnow@ajaxtown.com",
        password: "$2a$10$.dPLmaFVW2jTF/rMcUPRjucno5oKMwVMGeTjrPGDVinSQtPNy9Mdy"
    }).then(author => {
        Post.create({
            title: "John",
            body: "body",
            author: "Hancock",
            excerpt: "exceprt",
            cover_image: "../../",
            type: "page",
            status: "draft",
            slug: "/..//./slug",
            author_id: author.id
        }).then(post => {
            return Taxonomies.create({
                name: "Uncategorized",
                type: "post_category"
            })
                .then(taxonomy => {
                    return PostTaxonomyRelationship.create({
                        posts1_id: post.id,
                        taxonomies1_id: taxonomy.id
                    });
                })
                .then(() => {
                    return Taxonomies.create({
                        name: "Categorized",
                        type: "post_category"
                    }).then(taxonomy => {
                        return PostTaxonomyRelationship.create({
                            posts1_id: post.id,
                            taxonomies1_id: taxonomy.id
                        });
                    });
                });
        });
    });
}
conn.sync({ force: true }).then(() => {
    return createRecord();
});

export default conn;
