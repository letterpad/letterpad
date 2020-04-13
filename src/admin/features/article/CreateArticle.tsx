import React, { useEffect } from "react";

import { CREATE_POST } from "../../../shared/queries/Mutations";
import { IAdminRouteProps } from "../../../types/types";
import Loader from "../../components/loader";
import { Post } from "../../../__generated__/gqlTypes";
import PostActions from "./PostActions";
import apolloClient from "../../../shared/apolloClient";
import util from "../../../shared/util";

const CreateArticle: React.FC<IAdminRouteProps> = ({ router, type }) => {
  useEffect(() => {
    createPost().then(post => {
      PostActions.setData({} as Post);
      router.history.replace(`/admin/${util.plural[type]}/${post.id}`);
      PostActions.setData(post);
    });
  }, []);

  const createPost = async () => {
    const result = await apolloClient(true).mutate({
      mutation: CREATE_POST,
      variables: { data: { type } },
    });
    return result.data.createPost.post;
  };
  return <Loader />;
};

export default CreateArticle;
