import {
  Query,
  QueryPostArgs,
  Setting,
  SettingOptions,
} from "../../../__generated__/gqlTypes";

import { Container } from "./Article.css";
import Edit from "./Edit";
import Loader from "../../components/loader";
import OhSnap from "../../components/oh-snap";
import PostActions from "./PostActions";
import { QUERY_POST } from "../../../shared/queries/Queries";
import React from "react";
import TopBar from "./topbar";
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

  return (
    <Container fullHeight>
      <TopBar edit router={router} post={data.post} />
      <div className="article-holder">
        <Edit theme={theme} post={data.post} />
      </div>
    </Container>
  );
};

export default Article;
