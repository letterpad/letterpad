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

export default async function slugify(Model, slug) {
    slug = toSlug(slug);
    let found = await Model.find({ where: { slug: slug } });
    if (found === null) {
        return slug;
    }
    let count = 1;
    slug += "-";

    return (async function recursiveFindUniqueSlug() {
        found = await Model.find({ where: { slug: slug + count } });
        if (found === null) {
            return slug + count;
        }
        count++;
        return recursiveFindUniqueSlug();
    })();
}
