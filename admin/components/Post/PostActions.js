let PostActions = {
    data: {},
    taxonomies: {},
    postUpdated: function(action, data) {
        PostActions.triggerEvent(action, { detail: data });
    },
    triggerEvent: function(name, data) {
        // create and dispatch the event
        let event = new CustomEvent(name, { detail: data });
        window.dispatchEvent(event);
    },

    setData: data => {
        PostActions.data = {
            ...PostActions.data,
            ...data
        };
        PostActions.triggerEvent("onPostChange", data);
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
