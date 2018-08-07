import React, { Component } from "react";
import PropTypes from "prop-types";
import { EventBusInstance } from "shared/eventBus";
// A hack to remember the search text locally without asking parent
let SEARCH_TEXT_STATE = "";
export default class Search extends Component {
    static propTypes = {
        history: PropTypes.object,
        match: PropTypes.object
    };
    constructor(props) {
        super(props);
        this.state = {
            search: SEARCH_TEXT_STATE
        };
        this.onChange = this.onChange.bind(this);
        this.doSearch = this.doSearch.bind(this);
    }
    componentDidMount() {
        if (this.props.history.location.pathname.includes("/search/")) {
            this.setState({
                search: this.props.history.location.pathname.split("/").pop(-1)
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

        // if (query.length >= 0) {
        EventBusInstance.publish("SEARCH_QUERY", { query, type: "post" });
        // SEARCH_TEXT_STATE = query;
        // if (this.props.history.location.pathname.indexOf("/search/") === -1) {
        //     this.props.history.push("/search/" + query);
        // }
        // } else {
        //     this.props.history.replace({
        //         ...this.props.history.location,
        //         pathname: "/search/" + query
        //     });
        // }
        // this.setState({ search: query });
        // setTimeout(() => {
        //     // refs will not work because it looses value
        //     document.querySelector("#search-input").focus();
        // }, 100);
    };
    setSearchUrl = () => {
        if (this.props.history.location.pathname.indexOf("/search/") === -1) {
            this.props.history.push("/search/-");
            setTimeout(
                () => document.querySelector("#search-input").focus(),
                300
            );
        }
    };
    render() {
        return (
            <div className="search-box">
                <div className="x_content">
                    <div className="form-group">
                        <input
                            className="form-control"
                            //defaultValue={this.state.search}
                            onChange={this.doSearch}
                            placeholder="Search the site"
                            onClick={this.setSearchUrl}
                            // onKeyDown={this.doSearch}
                            id="search-input"
                        />
                    </div>
                </div>
            </div>
        );
    }
}
