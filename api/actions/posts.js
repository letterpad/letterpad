var pool = require("../../config/mysql.config").pool;
var siteConfig = require("../../config/site.config");
import { formatTaxonomyForDBInsert } from "../utils/common";
import path from "path";
import multer from "multer";

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, "../../public/uploads/"));
    },
    filename: function(req, file, cb) {
        let ext = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + Date.now() + ext);
    },
});

var upload = multer({ storage: storage }).single("file");
import moment from "moment";

// This function is to insert multiple posts at once.
// So if its a single post, wrap it inside an array
export function insertPosts(req, params) {
    return new Promise((resolve, reject) => {
        if (!req.body.data) {
            reject({ msg: "No params with key data was found" });
            return;
        }
        pool.getConnection((err, connection) => {
            let data = req.body.data;
            let posts = [];
            let taxonomies = { tags: [], categories: [] };
            data.forEach(post => {
                let item = [
                    post.title,
                    post.body,
                    post.author,
                    post.excerpt,
                    post.cover_image,
                    post.type,
                    new Date().toISOString().slice(0, 19).replace("T", " "),
                    post.permalink,
                ];
                taxonomies.tags.push(post.tags);
                taxonomies.categories.push(post.categories);
                posts.push(item);
            });

            connection.query(
                "INSERT INTO posts (title, body, author, excerpt, cover_image, type, created_on, permalink) VALUES ?",
                [posts],
                (err, rows) => {
                    if (err) throw err;
                    connection.release();
                    let firstInsertID = rows.insertId;
                    insertTaxonomies("post_tag", post.tags, firstInsertID)
                        .then(() => {
                            return insertTaxonomies(
                                "post_category",
                                post.categories,
                                firstInsertID,
                            );
                        })
                        .then(() => {
                            getPost(null, [post.id]).then(data => {
                                resolve(data);
                            });
                        })
                        .catch(err => {
                            reject(err);
                        });
                },
            );
        });
    });
}

export function updatePost(req, params) {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            let post = req.body.data;

            connection.query(
                "UPDATE posts SET title=?, body=?, author=?, excerpt=?, cover_image=?, type=?,status=?, permalink=? WHERE id=?",
                [
                    post.title,
                    post.body,
                    post.author,
                    post.excerpt,
                    post.cover_image,
                    post.type,
                    post.status,
                    post.permalink,
                    post.id,
                ],
                (err, rows) => {
                    if (err) reject(err);
                    insertTaxonomies(
                        "post_tag",
                        post.taxonomies.post_tag || [],
                        post.id,
                    )
                        .then(() => {
                            return insertTaxonomies(
                                "post_category",
                                post.taxonomies.post_category || [],
                                post.id,
                            );
                        })
                        .then(() => {
                            getPost(null, [post.id]).then(data => {
                                resolve(data);
                            });
                        })
                        .catch(err => {
                            reject(err);
                        });
                },
            );
        });
    });
}

export function insertTaxonomies(type, values, post_id) {
    return new Promise((resolve, reject) => {
        let post_tags = [];
        //get exisiting tags
        getTaxonomyList()
            .then(result => {
                let new_tags = [];
                let dictionary = {};
                if (!result[type]) {
                    result[type] = [];
                }
                // result.tags - exisiting
                result[type].forEach(tag => {
                    dictionary[tag.id] = tag;
                });
                //compare
                values.forEach(taxonomy => {
                    if (!dictionary[taxonomy.id]) {
                        new_tags.push([taxonomy.name, type]);
                    }

                    if (taxonomy.id !== 0) {
                        post_tags.push(taxonomy.id);
                    }
                });

                return new_tags;
            })
            .then(new_tags => {
                if (new_tags.length === 0) {
                    return null;
                }
                return new Promise((resolve, reject) => {
                    pool.getConnection((err, connection) => {
                        connection.query(
                            `INSERT INTO taxonomies (name, type) VALUES ?`,
                            [new_tags],
                            (err, rows) => {
                                connection.release();
                                if (err) throw err;
                                resolve({
                                    new_tags: new_tags,
                                    lastId: rows.insertId,
                                });
                            },
                        );
                    });
                });
            })
            .then(result => {
                if (result === null) {
                    return null;
                }
                return new Promise((resolve, reject) => {
                    let values = [];
                    let tag_id = result.lastId;
                    result.new_tags.forEach(tag => {
                        post_tags.push(tag_id);
                        values.push([post_id, tag_id]);
                        tag_id++;
                    });
                    pool.getConnection((err, connection) => {
                        connection.query(
                            "INSERT INTO post_taxonomy_relation(post_id, taxonomy_id) VALUES ?",
                            [values],
                            (err, rows) => {
                                if (err) throw err;
                                connection.release();
                                resolve(post_tags);
                            },
                        );
                    });
                });
            })
            .then(result => {
                if (post_tags.length === 0) {
                    return null;
                }
                return new Promise((resolve, reject) => {
                    pool.getConnection((err, connection) => {
                        connection.query(
                            `DELETE ptr FROM post_taxonomy_relation ptr
                            INNER JOIN taxonomies t ON ptr.taxonomy_id = t.id
                            WHERE t.type=? AND ptr.post_id = ? AND ptr.taxonomy_id NOT IN (${post_tags.join(
                                ",",
                            )})`,
                            [type, post_id],
                            (err, rows) => {
                                if (err) throw err;
                                connection.release();
                                resolve();
                            },
                        );
                    });
                });
            })
            .then(() => {
                resolve({});
            })
            .catch(e => {
                reject(e);
            });
    });
}
/* params = [
    'page',
    {page},
    (optional) {draft, published}
   ]
*/
export function getPosts(req, params) {
    return new Promise((resolve, reject) => {
        if (params.length < 2) {
            reject({
                data: [],
                count: 0,
                status: 500,
                message: "Invalid paramaters",
            });
            return;
        }
        //First page should be actually 0th page.)
        let low = (params[1] - 1) * siteConfig.items_per_page;
        let high = siteConfig.items_per_page;
        pool.getConnection((err, connection) => {
            let where = " 1=1 & ";
            if (params[2]) {
                where += `status='${params[1]}' AND `;
            }
            where += " 1=1 ";
            connection.query(
                `SELECT count(*) as count FROM posts WHERE ${where}`,
                (err, rows) => {
                    let count = rows[0].count;
                    connection.query(
                        `SELECT * FROM posts WHERE ${where} ORDER BY created_on DESC LIMIT ?,?`,
                        [low, high],
                        (err, records) => {
                            if (err) throw err;
                            connection.release();
                            resolve({
                                data: records,
                                count: count,
                                status: 200,
                            });
                        },
                    );
                },
            );
        });
    });
}

// params = [
//     permalink
// ]
export function getPostByUrl(req, params) {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            connection.query(
                "SELECT * FROM posts WHERE permalink=?",
                params[0],
                (err, rows) => {
                    if (err) reject(err);
                    connection.release();
                    resolve(rows[0]);
                },
            );
        });
    });
}

export function getPost(req, params) {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            connection.query(
                `SELECT p.*,
                    CONCAT('[', GROUP_CONCAT(CONCAT('{"id":', t.id, ',"type":"', t.type, '", "name":"',t.name,'"}')), ']') AS taxonomies
                    FROM posts p
                    LEFT JOIN post_taxonomy_relation ptr ON ptr.post_id = p.id
                    LEFT JOIN taxonomies t ON t.id = ptr.taxonomy_id
                where p.id=?
                GROUP BY p.id `,
                params[0],
                (err, rows) => {
                    if (err) reject(err);
                    connection.release();
                    let mixed_taxonomies = rows[0].taxonomies === null
                        ? []
                        : JSON.parse(rows[0].taxonomies);
                    let taxonomies = {};
                    mixed_taxonomies.forEach(taxonomy => {
                        if (!taxonomies[taxonomy.type]) {
                            taxonomies[taxonomy.type] = [];
                        }
                        taxonomies[taxonomy.type].push(taxonomy);
                    });
                    delete rows[0].taxonomies;
                    resolve({
                        ...rows[0],
                        taxonomies: taxonomies,
                    });
                },
            );
        });
    });
}

export function getTaxonomyList() {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            connection.query("SELECT * FROM taxonomies", (
                err,
                rows,
                fields,
            ) => {
                if (err) throw err;
                connection.release();
                let result = {};
                rows.forEach(item => {
                    if (!result[item.type]) {
                        result[item.type] = [];
                    }
                    result[item.type].push(item);
                });
                resolve(result);
            });
        });
    });
}

export function uploadFile(req, params) {
    return new Promise((resolve, reject) => {
        upload(req, null, function(err) {
            if (err) {
                return reject(err);
            }

            resolve("/uploads/" + req.file.filename);
        });
    });
}

export function uploadCoverImage(req, params) {
    return new Promise((resolve, reject) => {
        upload(req, null, function(err) {
            if (err) {
                return reject(err);
            }
            pool.getConnection((err, connection) => {
                connection.query(
                    "UPDATE posts SET cover_image=? WHERE id=?",
                    ["/uploads/" + req.file.filename, req.body.post_id],
                    (err, rows, fields) => {
                        if (err) throw err;
                        connection.release();
                        resolve("/uploads/" + req.file.filename);
                    },
                );
            });
        });
    });
}

export function removeFeaturedImage(req, params) {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            connection.query(
                "UPDATE posts SET cover_image='' WHERE id=?",
                req.body.post_id,
                (err, rows, fields) => {
                    if (err) throw err;
                    connection.release();
                    resolve();
                },
            );
        });
    });
}
