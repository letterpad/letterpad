import React, { Component } from "react";
import PropTypes from "prop-types";
import Posts from "./Posts";
import SinglePage from "./SinglePage";

export default class Home extends Component {
    render() {
        if (this.props.type === "category") {
            return <Posts slug={this.props.slug} {...this.props} />;
        }
        return <SinglePage slug={this.props.slug} {...this.props} />;
    }
}

Home.propTypes = {
    settings: PropTypes.object,
    route: PropTypes.func,
    match: PropTypes.object,
    type: PropTypes.string,
    slug: PropTypes.string
};
