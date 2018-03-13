import React, { Component } from "react";
import { graphql } from "react-apollo";
import PropTypes from "prop-types";
import StackGrid from "react-stack-grid";
import { GettingStarted, QuickDraft, Stats } from "../../components/Home";
import { BLOG_STATS } from "../../../shared/queries/Queries";
import { CREATE_POST } from "../../../shared/queries/Mutations";

class Home extends Component {
    constructor(props) {
        super(props);
        this.draftPost = this.draftPost.bind(this);
        document.body.classList.add("home-page");
    }

    componentWillUnmount() {
        document.body.classList.remove("home-page");
    }

    draftPost() {
        const qsv = ele => document.querySelector(ele).value;
        this.props
            .createPost({
                title: qsv("#quick-post-title"),
                body: qsv("#quick-post-body"),
                type: "post"
            })
            .then(res => {
                //...
            });
    }

    render() {
        return (
            <section className="module-xs">
                <StackGrid
                    className="post-grid with-padding"
                    columnWidth={"50%"}
                    gutterWidth={12}
                    gutterHeight={12}
                >
                    <GettingStarted />
                    <QuickDraft draftPost={this.draftPost} />
                    <Stats
                        loading={this.props.loading}
                        stats={this.props.stats}
                    />
                </StackGrid>
            </section>
        );
    }
}

Home.propTypes = {
    stats: PropTypes.object,
    loading: PropTypes.bool,
    createPost: PropTypes.func
};

const ContainerWithData = graphql(BLOG_STATS, {
    props: ({ data: { loading, stats } }) => ({
        stats,
        loading
    })
});

const createPostWithData = graphql(CREATE_POST, {
    props: ({ mutate }) => ({
        createPost: data =>
            mutate({
                variables: data
            })
    })
});

export default createPostWithData(ContainerWithData(Home));
