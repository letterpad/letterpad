import { Post, Taxonomy } from "../../../__generated__/gqlTypes";

interface IPostActions {
  triggerEvent: (name: string, data: any) => void;
  setData: (data: object) => void;
  getData: () => Post;
  removeTaxonomy: (taxonomy: Taxonomy) => void;
  addTaxonomy: (taxonomy: Taxonomy) => void;
}

let PostActions: IPostActions = (() => {
  let postData: Post;
  return {
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
      postData = {
        ...postData,
        ...data,
      };
      PostActions.triggerEvent("onPostChange", data);
    },

    getData: () => {
      return postData;
    },

    removeTaxonomy: (taxonomy: Taxonomy) => {
      if (!postData) return;
      postData.taxonomies = PostActions.getData().taxonomies.filter(
        item => item.id !== taxonomy.id,
      );
    },

    addTaxonomy: (taxonomy: Taxonomy) => {
      const taxonomies = [...PostActions.getData().taxonomies, taxonomy];
      if (postData) {
        postData.taxonomies = taxonomies;
      }
    },
  };
})();

export default PostActions;
