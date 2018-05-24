import React, { Component } from "react";
import PropTypes from "prop-types";
import { GettingStarted, QuickDraft, Stats } from "../../components/Home";
import CreatePost from "../../data-connectors/CreatePost";
import GetStats from "../../data-connectors/GetStats";

class Home extends Component {
    constructor(props) {
        super(props);
        this.draftPost = this.draftPost.bind(this);
        document.body.classList.add("home-page");
    }
    componentDidMount() {
        const elem = document.querySelector(".masonry-grid");
        setTimeout(() => {
            new Masonry(elem, {
                itemSelector: ".masonry-grid-item",
                gutter: 16
            });
        }, 100);
    }

    componentWillUnmount() {
        document.body.classList.remove("home-page");
    }

    draftPost() {
        const qsv = ele => document.querySelector(ele).value;
        this.props.createPost({
            title: qsv("#quick-post-title"),
            body: qsv("#quick-post-body"),
            type: "post"
        });
    }

    render() {
        return (
            <section className="module-xs">
                <div className="masonry-grid">
                    <GettingStarted />
                    <QuickDraft draftPost={this.draftPost} />
                    <Stats
                        loading={this.props.loading}
                        stats={this.props.stats}
                    />
                </div>
            </section>
        );
    }
}

Home.propTypes = {
    stats: PropTypes.object,
    loading: PropTypes.bool,
    createPost: PropTypes.func
};

export default CreatePost(GetStats(Home));
