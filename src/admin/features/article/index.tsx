import React from "react";
import { useQuery } from "react-apollo";

import OhSnap from "../../components/oh-snap";
import Edit from "./Edit";
import TopBar from "./topbar";
import Loader from "../../components/loader";
import { QUERY_POST } from "../../../shared/queries/Queries";
import { Container } from "./Article.css";
import { Query, QueryPostArgs } from "../../../__generated__/gqlTypes";

interface IArticleProps {
  router: any;
  manageScroll: Function;
  theme: string;
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
