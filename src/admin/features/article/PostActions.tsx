let PostActions: any = {
  data: {},

  triggerEvent: (name, data) => {
    // create and dispatch the event
    let event = new CustomEvent(name, { detail: data });
    window.dispatchEvent(event);
  },

  setData: data => {
    if (data.taxonomies) {
      data.taxonomies = data.taxonomies.map(item => {
        const { __typename, ...rest } = item;
        return rest;
      });
    }
    PostActions.data = {
      ...PostActions.data,
      ...data,
    };
    PostActions.triggerEvent("onPostChange", data);
  },

  getData: () => {
    let taxonomies: Array<any> = [];
    for (let type in PostActions.taxonomySuggestions) {
      PostActions.taxonomySuggestions[type].forEach((obj: any) => {
        taxonomies.push(obj);
      });
    }
    // PostActions.data.taxonomies = taxonomies;
    return PostActions.data;
  },

  removeTaxonomy: taxonomy => {
    PostActions.data.taxonomies = PostActions.getData().taxonomies.filter(
      item => item.id !== taxonomy.id,
    );
  },

  addTaxonomy: taxonomy => {
    const taxonomies = [...PostActions.getData().taxonomies, taxonomy];
    PostActions.data.taxonomies = taxonomies;
  },
};

export default PostActions;
