import config from "../../../config";

let PostActions = {
    data: {},
    subscribers: {},
    taxonomies: {},

    postUpdated: function(action, data) {
        for (let obj in PostActions.subscribers) {
            const cb = PostActions.subscribers[obj];
            if (cb.action === action) {
                cb.subscriber(data);
            }
        }
    },
    subscribe: function(action, subscriber) {
        PostActions.subscribers[subscriber] = { subscriber, action };
    },
    setData: data => {
        PostActions.data = {
            ...PostActions.data,
            ...data
        };
        for (let obj in PostActions.subscribers) {
            const cb = PostActions.subscribers[obj];
            if (cb.action === "change") {
                cb.subscriber(data);
            }
        }
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
