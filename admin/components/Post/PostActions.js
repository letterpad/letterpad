import fetch from "isomorphic-fetch";
import config from "../../../config";
let PostActions = {
    data: {},
    subscribers: {},
    taxonomies: {},

    uploadFile: (files, insertMedia) => {
        var data = new FormData();
        data.append("file", files[0]);

        return fetch(config.uploadUrl, {
            method: "post",
            body: data
        })
            .then(data => {
                return data.json();
            })
            .then(async image => {
                await insertMedia({ url: image });
                return image;
            });
    },
    postUpdated: function(data) {
        for (let subscriber in PostActions.subscribers) {
            PostActions.subscribers[subscriber](data);
        }
    },
    subscribe: function(subscriber) {
        PostActions.subscribers[subscriber] = subscriber;
    },
    // removeFeaturedImage: () => {},

    // insertImageInPost: () => {},

    // updatePost: () => {
    //     return PostActions.props.update(PostActions.getData());
    // },

    setData: data => {
        PostActions.data = {
            ...PostActions.data,
            ...data
        };
    },

    getData: () => {
        let taxonomies = [];
        for (let type in PostActions.taxonomies) {
            PostActions.taxonomies[type].forEach(obj => {
                taxonomies.push(obj);
            });
        }
        PostActions.data.taxonomies = taxonomies;
        return PostActions.data;
    },

    setTaxonomies: taxonomies => {
        PostActions.taxonomies = {
            ...PostActions.getTaxonomies(),
            ...taxonomies
        };
    },

    getTaxonomies: () => {
        return PostActions.taxonomies;
    }
};

export default PostActions;
