import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import OhSnap from "../../components/oh-snap";
import Edit from "./Edit";
import TopBar from "./topbar";
import Loader from "../../components/loader";
import { GET_SINGLE_POST } from "../../../shared/queries/Queries";
import { Query } from "react-apollo";

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  min-height: ${p => (p.fullHeight ? "100vh" : "auto")};

  .article-holder {
    width: 100%;
    margin: 80px auto 0;
    padding: 0 10px;

    .post-content {
      flex: 1;
    }
  }
`;

class Article extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    post: PropTypes.object,
    router: PropTypes.object,
    manageScroll: PropTypes.func,
    theme: PropTypes.string,
    match: PropTypes.object,
  };

  async componentDidMount() {
    document.body.classList.add("edit-post-page");
  }

  componentWillUnmount() {
    document.body.classList.remove("edit-post-page");
  }

  render() {
    return (
      <Query
        query={GET_SINGLE_POST}
        variables={{
          filters: {
            id: parseInt(this.props.router.match.params.post_id),
          },
        }}
      >
        {result => {
          const { loading, data } = result;
          if (loading) {
            return <Loader />;
          }
          if (!data.getSinglePost) {
            return (
              <OhSnap message="This page is either dead for good or restricted." />
            );
          }
          return (
            <FlexColumn fullHeight>
              <TopBar
                edit
                history={this.props.router.history}
                post={data.getSinglePost}
              />
              <div className="article-holder">
                <Edit
                  theme={this.props.theme}
                  post={data.getSinglePost}
                  setHtml={this.setHtml}
                />
              </div>
            </FlexColumn>
          );
        }}
      </Query>
    );
  }
}

export default Article;
