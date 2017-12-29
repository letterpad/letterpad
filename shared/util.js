export const parseErrors = errObj => {
    const result = [];
    if (errObj && errObj.errors) {
        errObj.errors.map(({ message, path }) => {
            result.push({ message, path });
        });
    }
    return result;
};

export const plural = {
    post: "posts",
    page: "pages"
};
