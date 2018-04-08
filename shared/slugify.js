"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = slugify;
function toSlug(str) {
    return str
        .toLowerCase()
        .replace(/[^\w\s\-]/g, " ")
        .split(" ")
        .filter(function(substr) {
            return substr.length > 0;
        })
        .join("-");
}

function slugify(Model, slug) {
    slug = toSlug(slug);
    return Model.find({ where: { slug: slug } }).then(function(result) {
        if (result === null) {
            return slug;
        }
        var count = 1;
        slug += "-";

        return (function recursiveFindUniqueSlug() {
            return Model.find({ where: { slug: slug + count } }).then(function(
                result
            ) {
                if (result === null) {
                    return slug + count;
                }
                count++;
                return recursiveFindUniqueSlug();
            });
        })();
    });
}
