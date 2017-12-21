// We want to convert
// ['tag1, tag2', 'tag3, tag4', 'tag5, tag6']
// to
// [[postId,tag1], [postId,tag2], [postId + 1,tag3], [postId + 1, tag4].....
export function formatTaxonomyForDBInsert(taxonomies, firstInsertID) {
    let result = [];
    console.log(taxonomies);
    taxonomies.map(function(items) {
        console.log(items);
        let taxItems = items.split(",");

        taxItems.forEach(function(taxonomy) {
            result.push([firstInsertID, taxonomy]);
        });
        firstInsertID++;
    });
    return result;
}

export class UnauthorizedError extends Error {
    constructor({ statusCode = 401, url }) {
        super("Unauthorized request to " + url);
        this.statusCode = statusCode;
    }
}
