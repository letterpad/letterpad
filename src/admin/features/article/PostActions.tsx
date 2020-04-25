import { EventBusInstance, Events } from "../../../shared/eventBus";
import {
  Post,
  Taxonomy,
  TaxonomyTypes,
  UpdatePostMutation,
} from "../../../__generated__/gqlTypes";

import { FetchResult } from "apollo-link";
import { UPDATE_POST_QUERY } from "../../../shared/queries/Mutations";
import client from "../../../shared/apolloClient";

interface IPostActionArgs {
  withHtml: boolean;
}
interface IPostActions {
  triggerEvent: (name: string, data: any) => void;
  setData: (data: Post) => void;
  setDraft: (data: { [T in keyof Partial<Post>]: Post[T] }) => void;
  getData: () => Post;
  removeFromDraft: (key: keyof Partial<Post>) => void;
  getDraft: () => { [T in keyof Partial<Post>]: Post[T] };
  removeTaxonomy: (taxonomy: Taxonomy, type: TaxonomyTypes) => void;
  addTaxonomy: (taxonomy: Taxonomy, type: TaxonomyTypes) => void;
  updatePost: (
    params?: IPostActionArgs,
  ) => Promise<FetchResult<UpdatePostMutation>>;
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
      if (Object.keys(data).length > 0) {
        draftData = { id: data.id };
        postData = data;
      } else {
        postData = {} as Post;
      }
      PostActions.triggerEvent("onPostChange", data);
    },

    setDraft: data => {
      if (data.md && !didBodyChange(data.md)) {
        return;
      }
      draftData = {
        ...draftData,
        ...data,
      };
      EventBusInstance.publish(Events.DRAFT_CHANGED);
    },

    removeFromDraft: key => {
      delete draftData[key];
    },

    getData: () => {
      return postData;
    },

    getDraft: () => {
      return { ...draftData };
    },

    removeTaxonomy: (taxonomy: Taxonomy, type: TaxonomyTypes) => {
      if (!postData) return;
      postData[type] = PostActions.getData()[type].filter(
        item => item.id !== taxonomy.id,
      );
      const draft = postData[type].map(item => {
        const { __typename, ...rest } = item;
        return rest;
      });
      draftData[type] = draft;
    },

    addTaxonomy: (taxonomy: Taxonomy, type: TaxonomyTypes) => {
      const taxonomies = [...PostActions.getData()[type], taxonomy];
      if (postData) {
        postData[type] = taxonomies;
        const draft = postData[type].map(item => {
          const { __typename, ...rest } = item;
          return rest;
        });
        draftData[type] = draft;
      }
    },

    updatePost: async (params = { withHtml: false }) => {
      EventBusInstance.publish(Events.SAVING);
      const data = PostActions.getDraft();
      const update = await client().mutate<UpdatePostMutation>({
        mutation: UPDATE_POST_QUERY,
        variables: {
          data,
        },
      });
      if (update.data) {
        PostActions.setData(update.data.updatePost.post as Post);
        draftData = { id: postData.id };
        EventBusInstance.publish(Events.SAVED);
      }
      return update;
    },
  };
})();

export default PostActions;

const didBodyChange = md => {
  const post = PostActions.getData();
  if (htmlEntities(md) !== htmlEntities(post.md)) {
    return true;
  }
  return false;
};

function htmlEntities(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&quot;");
}
