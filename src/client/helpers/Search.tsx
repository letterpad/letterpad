import React, { Component } from "react";

import PropTypes from "prop-types";
import { RouteComponentProps } from "react-router";

export default class Search extends Component<
  { history: RouteComponentProps["history"] },
  {}
> {
  static propTypes = {
    history: PropTypes.object,
    match: PropTypes.object,
  };

  state = {
    search: "",
  };

  componentDidMount() {
    if (this.props.history.location.pathname.includes("/search/")) {
      this.setState({
        search: this.props.history.location.pathname.split("/").pop(),
      });
    } else {
      this.setState({ search: "" });
    }
  }

  onChange = e => {
    this.setState({ search: e.target.value });
  };

  doSearch = e => {
    const query = e.target.value.trim();
    // EventBusInstance.publish("SEARCH_QUERY", { query, type: "post" });
  };

  setSearchUrl = () => {
    if (this.props.history.location.pathname.indexOf("/search/") === -1) {
      this.props.history.push("/search/");
      setTimeout(() => {
        const node: HTMLInputElement | null = document.querySelector(
          "#search-input",
        );
        if (node) node.focus();
      }, 300);
    }
  };

  render() {
    return (
      <div className="search-box">
        <div className="x_content">
          <div className="form-group">
            <input
              className="form-control"
              onChange={this.doSearch}
              placeholder="Search the site"
              onClick={this.setSearchUrl}
              id="search-input"
            />
          </div>
        </div>
      </div>
    );
  }
}
