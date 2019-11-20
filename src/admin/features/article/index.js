import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import OhSnap from "../../components/oh-snap";
import Edit from "./Edit";
import TopBar from "./topbar";
import Loader from "../../components/loader";
// import GetSinglePost from "../../data-connectors/GetSinglePost";
import { GET_SINGLE_POST } from "../../../shared/queries/Queries";
import { executeQuery } from "../../../shared/executeQuery";

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
    history: PropTypes.object,
    manageScroll: PropTypes.func,
    theme: PropTypes.string,
    match: PropTypes.object,
  };

  state = {
    loading: true,
    post: null,
  };

  async componentDidMount() {
    document.body.classList.add("edit-post-page");
    const result = await executeQuery(GET_SINGLE_POST, {
      filters: {
        id: parseInt(this.props.match.params.post_id),
      },
    });
    this.setState({
      post: result.data.getSinglePost,
      loading: false,
    });
  }

  componentWillUnmount() {
    document.body.classList.remove("edit-post-page");
  }

  render() {
    if (this.state.loading) {
      return <Loader />;
    }
    if (!this.state.post) {
      return (
        <OhSnap message="This page is either dead for good or restricted." />
      );
    }
    return (
      <FlexColumn fullHeight>
        <TopBar edit history={this.props.history} post={this.state.post} />
        <div className="article-holder">
          <Edit
            theme={this.props.theme}
            post={this.state.post}
            setHtml={this.setHtml}
          />
        </div>
      </FlexColumn>
    );
  }
}

export default Article;
