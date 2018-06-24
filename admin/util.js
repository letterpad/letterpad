import config from "../config";

export const uploadFile = async ({ files, type }) => {
    var data = new FormData();
    data.append("type", type);
    for (let i = 0; i < files.length; i++) {
        data.append("file", files[i]);
    }

    return await fetch(config.uploadUrl, {
        method: "post",
        body: data,
        headers: {
            authorization: localStorage.token
        }
    })
        .then(data => {
            return data.json();
        })
        .then(async image => {
            return image;
        });
};
