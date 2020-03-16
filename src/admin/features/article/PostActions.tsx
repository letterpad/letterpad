import {
  Post,
  Taxonomy,
  UpdatePostMutation,
} from "../../../__generated__/gqlTypes";

import { FetchResult } from "apollo-link";
import { UPDATE_POST_QUERY } from "../../../shared/queries/Mutations";
import client from "../../../shared/apolloClient";
import { deepMerge } from "../../../shared/deepMerge";

interface IPostActions {
  triggerEvent: (name: string, data: any) => void;
  setData: (data: Post | {}) => void;
  setDraft: (data: { [T in keyof Partial<Post>]: Post[T] }) => void;
  getData: () => Post;
  getDraft: () => { [T in keyof Partial<Post>]: Post[T] };
  removeTaxonomy: (taxonomy: Taxonomy) => void;
  addTaxonomy: (taxonomy: Taxonomy) => void;
  updatePost: () => Promise<FetchResult<UpdatePostMutation>>;
}

let PostActions: IPostActions = (() => {
  let postData: Post;
  let draftData: { [K in keyof Post]: Post[K] } | {};

  return {
    triggerEvent: (name, data) => {
      // create and dispatch the event
      let event = new CustomEvent(name, { detail: data });
      window.dispatchEvent(event);
    },

    setData: (data: Post) => {
      if (data.taxonomies) {
        data.taxonomies = data.taxonomies.map(item => {
          const { __typename, ...rest } = item;
          return rest;
        });
      }
      draftData = { id: data.id };
      postData = deepMerge(postData || {}, data) as Post;
      PostActions.triggerEvent("onPostChange", data);
    },

    setDraft: data => {
      draftData = {
        ...draftData,
        ...data,
      };
    },

    getData: () => {
      return postData;
    },

    getDraft: () => {
      return draftData;
    },

    removeTaxonomy: (taxonomy: Taxonomy) => {
      if (!postData) return;
      postData.taxonomies = PostActions.getData().taxonomies.filter(
        item => item.id !== taxonomy.id,
      );
      const draft = postData.taxonomies.map(item => {
        const { __typename, ...rest } = item;
        return rest;
      });
      draftData["taxonomies"] = draft;
    },

    addTaxonomy: (taxonomy: Taxonomy) => {
      const taxonomies = [...PostActions.getData().taxonomies, taxonomy];
      if (postData) {
        postData.taxonomies = taxonomies;
        const draft = postData.taxonomies.map(item => {
          const { __typename, ...rest } = item;
          return rest;
        });
        draftData["taxonomies"] = draft;
      }
    },

    updatePost: async () => {
      const data = PostActions.getDraft();
      const update = await client().mutate<UpdatePostMutation>({
        mutation: UPDATE_POST_QUERY,
        variables: {
          data,
        },
      });
      if (update.data) {
        postData = update.data.updatePost.post as Post;
        draftData = { id: data.id };
      }
      return update;
    },
  };
})();

export default PostActions;
