import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import OhSnap from "../../components/oh-snap";
import Edit from "./Edit";
import TopBar from "./topbar";
import Loader from "../../components/loader";
import GetSinglePost from "../../data-connectors/GetSinglePost";

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
  };

  // static defaultProps = {
  //   theme: "light",
  // };

  componentDidMount() {
    document.body.classList.add("edit-post-page");
  }

  componentWillUnmount() {
    document.body.classList.remove("edit-post-page");
  }

  render() {
    if (this.props.loading) {
      return <Loader />;
    }
    if (!this.props.post) {
      return (
        <OhSnap message="This page is either dead for good or restricted." />
      );
    }
    return (
      <FlexColumn fullHeight>
        <TopBar edit history={this.props.history} post={this.props.post} />
        <div className="article-holder">
          <Edit
            theme={this.props.theme}
            post={this.props.post}
            setHtml={this.setHtml}
          />
        </div>
      </FlexColumn>
    );
  }
}

export default GetSinglePost(Article);
