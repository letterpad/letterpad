import React, { Component } from "react";
import moment from "moment";
import PropTypes from "prop-types";
import styled from "styled-components";

import { ArticleCreate, PostPublish, PostActions } from "../../components/Post";
import CreatePost from "../../data-connectors/CreatePost";

const FlexColumn = styled.div`
    display: flex;
    flex-direction: column;
    height: ${p => (p.fullHeight ? "100vh" : "auto")};
`;

export class Create extends Component {
    static propTypes = {
        history: PropTypes.object,
        createPost: PropTypes.func.isRequired,
        type: PropTypes.string.isRequired,
        manageScroll: PropTypes.func
    };

    state = {
        loading: true,
        post: {},
        fileExplorerProps: {},
        actionDrawerOpen: false
    };

    componentDidMount() {
        const { type } = this.props;

        // This is going to hold all the changes done to the post.
        PostActions.data = {};
        // Add a default title to the newly created post
        const title = "Draft - " + moment().format("L LT");

        // create an empty post with the type and title
        this.props.createPost({ type, title }).then(result => {
            PostActions.setData(result.data.createPost.post);
            this.setState({
                loading: false,
                post: result.data.createPost.post
            });
        });

        document.body.classList.add("create-" + this.props.type + "-page");
    }

    componentWillUnmount() {
        document.body.classList.remove("create-" + this.props.type + "-page");
    }

    toggleActionDrawer = e => {
        e.preventDefault();
        this.setState({ actionDrawerOpen: !this.state.actionDrawerOpen });
    };

    toggleFileExplorerModal = props => {
        this.setState({
            fileExplorerProps: props
        });
    };

    render() {
        if (this.state.loading) {
            return <div />;
        }
        return (
            <FlexColumn fullHeight>
                <PostPublish
                    create
                    history={this.props.history}
                    post={this.state.post}
                    toggleActionDrawer={this.toggleActionDrawer}
                />
                <div className="article-holder">
                    <ArticleCreate post={this.state.post} />
                </div>
            </FlexColumn>
        );
    }
}

export default CreatePost(Create);
