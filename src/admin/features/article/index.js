import React, { Component } from "react";
import { Query } from "react-apollo";
import PropTypes from "prop-types";

import OhSnap from "../../components/oh-snap";
import Edit from "./Edit";
import TopBar from "./topbar";
import Loader from "../../components/loader";
import { GET_SINGLE_POST } from "../../../shared/queries/Queries";
import { Container } from "./Article.css";

class Article extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    post: PropTypes.object,
    router: PropTypes.object,
    manageScroll: PropTypes.func,
    theme: PropTypes.string,
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
          if (!data.post) {
            return (
              <OhSnap message="This page is either dead for good or restricted." />
            );
          }
          return (
            <Container fullHeight>
              <TopBar edit router={this.props.router} post={data.post} />
              <div className="article-holder">
                <Edit
                  theme={this.props.theme}
                  post={data.post}
                  setHtml={this.setHtml}
                />
              </div>
            </Container>
          );
        }}
      </Query>
    );
  }
}

export default Article;
