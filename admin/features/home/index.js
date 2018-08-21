import React, { Component } from "react";
import PropTypes from "prop-types";

import GettingStarted from "./GettingStarted";
import QuickDraft from "./QuickDraft";
import Stats from "./Stats";
import StyledSection from "../../components/section";
import { StyledHome } from "./Home.css";

import CreatePost from "../../data-connectors/CreatePost";
import GetStats from "../../data-connectors/GetStats";

class Home extends Component {
    static propTypes = {
        stats: PropTypes.object,
        loading: PropTypes.bool,
        createPost: PropTypes.func
    };

    componentDidMount() {
        document.body.classList.add("home-page");
        const elem = document.querySelector(".masonry-grid");
        setTimeout(() => {
            new Masonry(elem, {
                itemSelector: ".masonry-grid-item",
                gutter: 16
            });
        }, 300);
    }

    componentWillUnmount() {
        document.body.classList.remove("home-page");
    }

    draftPost = () => {
        const qsv = ele => document.querySelector(ele).value;
        this.props.createPost({
            title: qsv("#quick-post-title"),
            body: qsv("#quick-post-body"),
            type: "post"
        });
    };

    render() {
        return (
            <StyledSection xs>
                <StyledHome className="masonry-grid">
                    <GettingStarted />
                    <QuickDraft draftPost={this.draftPost} />
                    <Stats
                        loading={this.props.loading}
                        stats={this.props.stats}
                    />
                </StyledHome>
            </StyledSection>
        );
    }
}

export default CreatePost(GetStats(Home));
