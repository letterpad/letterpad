import React, { Component } from "react";
import PropTypes from "prop-types";

import StyledInput from "../../components/input";

class Search extends Component {
    static propTypes = {
        searchPosts: PropTypes.func
    };

    state = {
        page: 1,
        text: ""
    };

    // componentDidMount() {
    //     this.inputBox.addEventListener("search", this.handleClear);
    // }

    // componentWillUnmount() {
    //     this.inputBox.removeEventListener("search", this.handleClear);
    // }

    handleKeyUp = e => {
        const query = e.target.value.trim();
        if (query.length > 0 && e.keyCode === 13) {
            this.props.searchPosts(query, this.state.page);
        } else {
            this.setState({ text: query });
        }
        if (query.length === 0) {
            this.handleClear();
        }
    };

    handleClear = () => {
        this.props.searchPosts("");
    };

    render() {
        return (
            <StyledInput onKeyUp={this.handleKeyUp} placeholder="Search.." />
        );
    }
}

export default Search;
