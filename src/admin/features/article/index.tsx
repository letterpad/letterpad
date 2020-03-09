import {
  Query,
  QueryPostArgs,
  Setting,
  SettingOptions,
  UpdatePostMutation,
} from "../../../__generated__/gqlTypes";

import { Container } from "./Article.css";
import Edit from "./Edit";
import Loader from "../../components/loader";
import OhSnap from "../../components/oh-snap";
import PostActions from "./PostActions";
import { QUERY_POST } from "../../../shared/queries/Queries";
import React from "react";
import TopBar from "./topbar";
import { UPDATE_POST_QUERY } from "../../../shared/queries/Mutations";
import client from "../../../shared/apolloClient";
import config from "../../../config";
import { useQuery } from "react-apollo";

const host = config.ROOT_URL + config.BASE_NAME;

interface IArticleProps {
  router: any;
  manageScroll: Function;
  theme: string;
  settings: { [option in SettingOptions]: Setting };
}

const Article: React.FC<IArticleProps> = ({ theme, router }) => {
  const { loading, data } = useQuery<Query, QueryPostArgs>(QUERY_POST, {
    variables: {
      filters: {
        id: parseInt(router.match.params.post_id),
      },
    },
    fetchPolicy: "network-only",
  });
  if (loading) {
    return <Loader />;
  }
  if (!data || !data.post) {
    return (
      <OhSnap message="This page is either dead for good or restricted." />
    );
  }

  const updatePost = async () => {
    const data = PostActions.getData();
    const update = await client().mutate<UpdatePostMutation>({
      mutation: UPDATE_POST_QUERY,
      variables: {
        data: {
          id: data.id,
          title: data.title,
          html: data.html,
          md: data.md,
          excerpt: data.excerpt,
          cover_image: data.cover_image.replace(host, ""),
          publishedAt: data.publishedAt,
          type: data.type,
          status: data.status,
          slug: data.slug,
          taxonomies: data.taxonomies,
        },
      },
    });
    return update;
  };

  return (
    <Container fullHeight>
      <TopBar edit router={router} post={data.post} updatePost={updatePost} />
      <div className="article-holder">
        <Edit theme={theme} post={data.post} updatePost={updatePost} />
      </div>
    </Container>
  );
};

export default Article;
