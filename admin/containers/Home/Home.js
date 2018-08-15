import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { GettingStarted, QuickDraft, Stats } from "../../components/Home";
import CreatePost from "../../data-connectors/CreatePost";
import GetStats from "../../data-connectors/GetStats";

const StyledHome = styled.div`
    .listing {
        i {
            margin-right: 8px;
        }
    }
`;

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
        }, 200);
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
            <section className="module-xs">
                <StyledHome className="masonry-grid">
                    <GettingStarted />
                    <QuickDraft draftPost={this.draftPost} />
                    <Stats
                        loading={this.props.loading}
                        stats={this.props.stats}
                    />
                </StyledHome>
            </section>
        );
    }
}

export default CreatePost(GetStats(Home));
