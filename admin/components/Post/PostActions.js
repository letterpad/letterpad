import config from "../../../config";

let PostActions = {
    data: {},
    subscribers: {},
    taxonomies: {},

    postUpdated: function(data) {
        for (let subscriber in PostActions.subscribers) {
            PostActions.subscribers[subscriber](data);
        }
    },
    subscribe: function(subscriber) {
        PostActions.subscribers[subscriber] = subscriber;
    },
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
