import React, { Component } from "react";
import PropTypes from "prop-types";
import { ArticleEdit, PostPublish, PostActions } from "../../components/Post";
import OhSnap from "../OhSnap";
import Loader from "../../components/Loader";
import GetSinglePost from "../../data-connectors/GetSinglePost";
import styled from "styled-components";

const FlexColumn = styled.div`
    display: flex;
    flex-direction: column;
    height: ${p => (p.fullHeight ? "100vh" : "auto")};
`;

class Edit extends Component {
    static propTypes = {
        loading: PropTypes.bool,
        post: PropTypes.object,
        history: PropTypes.object,
        manageScroll: PropTypes.func
    };

    state = {
        preview: ""
    };

    componentWillMount() {
        window.addEventListener("onPostChange", this.handlePostChanges);
    }

    componentDidMount() {
        window.addEventListener("onPostChange", this.handlePostChanges);
        document.body.classList.add("edit-post-page");
    }

    componentWillUnmount() {
        document.body.classList.remove("edit-post-page");
        window.removeEventListener("onPostChange", this.handlePostChanges);
    }

    handlePostChanges = e => {
        if (PostActions.data.mode == "markdown") {
            this.props.manageScroll();
            if ("mdPreview" in e.detail) {
                this.setState({ preview: e.detail.mdPreview });
            }
        } else {
            this.setState({ preview: "" });
        }
    };

    render() {
        if (this.props.loading) {
            return <Loader />;
        }
        if (!this.props.post) {
            return (
                <OhSnap message="This page is either dead for good or restricted." />
            );
        }
        return (
            <FlexColumn fullHeight>
                <PostPublish
                    edit
                    history={this.props.history}
                    post={this.props.post}
                    toggleActionDrawer={this.toggleActionDrawer}
                />
                <div className="article-holder">
                    <ArticleEdit
                        post={this.props.post}
                        setHtml={this.setHtml}
                    />
                </div>
            </FlexColumn>
        );
    }
}

export default GetSinglePost(Edit);
