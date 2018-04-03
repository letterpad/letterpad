import config from "../config";

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

export const makeUrl = parts => {
    if (typeof parts === "string") {
        parts = [parts];
    }
    const url = config.rootUrl + "/" + parts.join("/");
    return url.replace(/\/\/+/g, "/");
};
