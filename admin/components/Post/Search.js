import React, { Component } from "react";

class Search extends Component {
    constructor(props) {
        super(props);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleClear = this.handleClear.bind(this);
        this.state = {
            page: 1,
            text: ""
        };
    }
    componentDidMount() {
        this.inputBox.addEventListener("search", this.handleClear);
    }
    componentWillUnmount() {
        this.inputBox.removeEventListener("search", this.handleClear);
    }

    handleKeyUp(e) {
        const query = e.target.value.trim();
        if (query.length > 0 && e.keyCode === 13) {
            this.props.searchPosts(query, this.state.page);
        } else {
            this.setState({ text: query });
        }
        if (query.length === 0) {
            this.handleClear();
        }
    }
    handleClear() {
        this.props.searchPosts("");
    }

    render() {
        return (
            <div
                className="form-group search-box"
                style={{ flex: 1, marginRight: 20 }}
            >
                <input
                    onKeyUp={this.handleKeyUp}
                    type="search"
                    className="form-control"
                    placeholder="Search.."
                    ref={input => {
                        if (input) this.inputBox = input;
                    }}
                />
            </div>
        );
    }
}

export default Search;
