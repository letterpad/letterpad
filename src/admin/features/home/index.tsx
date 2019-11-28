import React, { Component } from "react";
import PropTypes from "prop-types";

import GettingStarted from "./GettingStarted";
import QuickDraft from "./QuickDraft";
import Stats from "./Stats";
import StyledSection from "../../components/section";
import StyledGrid from "../../components/grid";
// import { StyledHome } from "./Home.css";

import GetStats from "../../data-connectors/GetStats";

class Home extends Component {
  static propTypes = {
    stats: PropTypes.object,
    loading: PropTypes.bool,
    createPost: PropTypes.func,
  };

  componentDidMount() {
    document.body.classList.add("home-page");
  }

  componentWillUnmount() {
    document.body.classList.remove("home-page");
  }

  render() {
    return (
      <StyledSection xs>
        <StyledGrid columns="repeat(auto-fit,minmax(400px,1fr))">
          <GettingStarted />
          <QuickDraft draftPost={this.draftPost} />
          <Stats loading={this.props.loading} stats={this.props.stats} />
        </StyledGrid>
      </StyledSection>
    );
  }
}

export default GetStats(Home);
