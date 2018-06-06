import config from "../config";

export const uploadFile = async ({ files, type }) => {
    var data = new FormData();
    data.append("type", type);
    data.append("file", files[0]);
    return await fetch(config.uploadUrl, {
        method: "post",
        body: data
    })
        .then(data => {
            return data.json();
        })
        .then(async image => {
            return image;
        });
};
