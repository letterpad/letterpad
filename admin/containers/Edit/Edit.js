import React, { Component } from "react";
import PropTypes from "prop-types";
import { ArticleEdit, PostPublish } from "../../components/Post";
import OhSnap from "../OhSnap";
import Loader from "../../components/Loader";
import GetSinglePost from "../../data-connectors/GetSinglePost";
import styled from "styled-components";

const FlexColumn = styled.div`
    display: flex;
    flex-direction: column;
    min-height: ${p => (p.fullHeight ? "100vh" : "auto")};
`;

class Edit extends Component {
    static propTypes = {
        loading: PropTypes.bool,
        post: PropTypes.object,
        history: PropTypes.object,
        manageScroll: PropTypes.func
    };

    componentDidMount() {
        document.body.classList.add("edit-post-page");
    }

    componentWillUnmount() {
        document.body.classList.remove("edit-post-page");
    }

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
