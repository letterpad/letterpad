/**
 * Responsible to analyise the taxonomy object and insert or delete
 * @param {String} type 
 * @param {Array} received_tags 
 * @param {Number} post_id 
 * @param {Object} taxList 
 */
export function insertTaxonomies(type, received_tags, post_id, taxList) {
    return new Promise((resolve, reject) => {
        let tags_to_be_linked = [];
        let new_tags = [];
        let dictionary = {};
        if (!taxList[type]) {
            taxList[type] = [];
        }
        // make a indexed taglist for easy search
        taxList[type].forEach(tag => {
            dictionary[tag.id] = tag;
        });
        // get existing tags of post
        getPostTaxonomies(post_id)
            .then(post_taxonomies => {
                return new Promise((resolve, reject) => {
                    const linked_tags = post_taxonomies.filter(ele => {
                        return ele.type === type;
                    });
                    //compare
                    received_tags.forEach(taxonomy => {
                        //not found in dictionary, so new tagnames
                        if (!dictionary[taxonomy.id]) {
                            new_tags.push([taxonomy.name, type]);
                        } else {
                            //existing
                            let found = linked_tags.filter(ele => {
                                return ele.id === taxonomy.id;
                            });
                            if (found.length === 0) {
                                tags_to_be_linked.push([post_id, taxonomy.id]);
                            }
                        }
                    });
                    resolve();
                });
            })
            .then(() => {
                /**
                 * Insert new tags
                 */
                if (new_tags.length === 0) {
                    return null;
                }
                return insertNewTags(new_tags);
            })
            .then(result => {
                if (result !== null && result.new_tags) {
                    let tag_id = result.lastId;
                    result.new_tags.forEach(tag => {
                        received_tags.push({
                            id: tag_id,
                            name: tag[0],
                            type: type
                        });
                        tags_to_be_linked.push([post_id, tag_id]);
                        tag_id++;
                    });
                }
                if (tags_to_be_linked.length === 0) {
                    return;
                }

                return insertTaxanomyRelation(tags_to_be_linked);
            })
            .then(() => {
                if (received_tags.length === 0) {
                    return null;
                }
                /**
                 * received_tags might contain new tags which didnt have any tag_id
                 * created. Clean them now.
                 */
                received_tags = received_tags
                    .map(val => {
                        if (val && val.id != 0) return val.id;
                    })
                    .filter(ele => typeof ele !== "undefined")
                    .join(", ");
                return deleteTaxanomyRelation(received_tags, type, post_id);
            });
    }).catch(e => {
        reject(e);
    });
}

export function getTaxonomyList() {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            connection.query("SELECT * FROM taxonomies", (
                err,
                rows,
                fields
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
export function getPostTaxonomies(post_id) {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            connection.query(
                "SELECT t.id,t.name,t.type FROM post_taxonomy_relation ptr INNER JOIN taxonomies t ON t.id = ptr.taxonomy_id WHERE PTR.post_id=?",
                post_id,
                (err, rows, fields) => {
                    if (err) throw err;
                    connection.release();
                    resolve(rows);
                }
            );
        });
    });
}

function insertNewTags(new_tags) {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            connection.query(
                `INSERT INTO taxonomies (name, type) VALUES ?`,
                [new_tags],
                (err, rows) => {
                    connection.release();
                    if (err) reject(err);
                    resolve({
                        new_tags: new_tags,
                        lastId: rows.insertId
                    });
                }
            );
        });
    });
}

function insertTaxanomyRelation(tags_to_be_linked) {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            connection.query(
                "INSERT INTO post_taxonomy_relation(post_id, taxonomy_id) VALUES ?",
                [tags_to_be_linked],
                (err, rows) => {
                    if (err) throw err;
                    connection.release();
                    resolve();
                }
            );
        });
    });
}

function deleteTaxanomyRelation(tags_to_be_linked, type, post_id) {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            connection.query(
                `DELETE ptr FROM post_taxonomy_relation ptr
                                        INNER JOIN taxonomies t ON ptr.taxonomy_id = t.id
                                        WHERE t.type=? AND ptr.post_id = ? AND ptr.taxonomy_id NOT IN (${received_tags})`,
                [type, post_id],
                (err, rows) => {
                    if (err) throw err;
                    connection.release();
                    resolve();
                }
            );
        });
    });
}
