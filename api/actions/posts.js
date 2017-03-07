var pool = require("../../config/mysql.config").pool;
var siteConfig = require("../../config/site.config");
import {insertTaxonomies, getTaxonomyList} from './taxonomies';
import path from "path";
import multer from "multer";

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, "../../public/uploads/"));
    },
    filename: function(req, file, cb) {
        let ext = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + Date.now() + ext);
    }
});

var upload = multer({ storage: storage }).single("file");
import moment from "moment";


/**
 * This function is to insert multiple posts at once.
 * So if its a single post, wrap it inside an array
 * @param {*} req 
 * @param {*} params 
 */
export function insertPosts(req, params) {
    return new Promise((resolve, reject) => {
        if (!req.body.data) {
            reject({ msg: "No params with key data was found" });
            return;
        }
        pool.getConnection((err, connection) => {
            let data = req.body.data;
            let posts = [];
            data.forEach(post => {
                let item = [
                    post.title,
                    post.body,
                    post.author,
                    post.excerpt,
                    post.cover_image,
                    post.type,
                    new Date().toISOString().slice(0, 19).replace("T", " "),
                    post.permalink
                ];
                posts.push(item);
            });

            connection.query(
                "INSERT INTO posts (title, body, author, excerpt, cover_image, type, created_on, permalink) VALUES ?",
                [posts],
                (err, rows) => {
                    if (err) throw err;
                    connection.release();
                    let insertId = rows.insertId;

                    let idx = 0;
                    function insertTaxonomyInit(data, idx, insertId) {
                        getTaxonomyList().then(taxList => {
                            insertTaxonomies(
                                "post_tag",
                                data[idx].taxonomies.post_tag,
                                insertId,
                                taxList
                            )
                            .then(() => {
                                return insertTaxonomies(
                                    "post_category",
                                    data[idx].taxonomies.post_category,
                                    insertId,
                                    taxList
                                );
                            })
                            .then(() => {
                                if (data.length === idx + 1) {
                                    getPost(null, [insertId]).then(data => {
                                        resolve(data);
                                    });
                                    return;
                                }
                                idx++;
                                insertId++;
                                insertTaxonomyInit(data, idx, insertId);
                            })
                            .catch(err => {
                                reject(err);
                            });
                        });
                    }
                    insertTaxonomyInit(data, idx, insertId);
                }
            );
        });
    });
}
/**
 * 
 * @param {*} req 
 * @param {*} params 
 */
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
                    post.id
                ],
                (err, rows) => {
                    if (err) reject(err);
                    getTaxonomyList().then(taxList => {
                        insertTaxonomies(
                            "post_tag",
                            post.taxonomies.post_tag || [],
                            post.id,
                            taxList
                        )
                        .then(() => {
                            return insertTaxonomies(
                                "post_category",
                                post.taxonomies.post_category || [],
                                post.id,
                                taxList
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
                    });
                }
            );
        });
    });
}

/**
 * 
 * @param {Object} req 
 * @param {Array} params ['page', {page}, (optional) {'draft','published','deleted'}]
 */
export function getPosts(req, params) {
    return new Promise((resolve, reject) => {
        if (params.length < 2) {
            reject({
                data: [],
                count: 0,
                status: 500,
                message: "Invalid paramaters"
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
                                status: 200
                            });
                        }
                    );
                }
            );
        });
    });
}

/**
 * 
 * @param {*} req 
 * @param {Array} params [permalink]
 */
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
                }
            );
        });
    });
}
/**
 * 
 * @param {Object} req 
 * @param {Array} params [(int) id]
 */
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
                        taxonomies: taxonomies
                    });
                }
            );
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
                    }
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
                }
            );
        });
    });
}
