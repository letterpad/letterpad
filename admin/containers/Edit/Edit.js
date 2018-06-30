import React, { Component } from "react";
import PropTypes from "prop-types";
import {
    ArticleEdit,
    PostPublish,
    PostActions,
    PostActionDrawer
} from "../../components/Post";
import { Link } from "react-router-dom";
import OhSnap from "../OhSnap";
import Loader from "../../components/Loader";
import GetSinglePost from "../../data-connectors/GetSinglePost";
import FileExplorerModal from "../../components/Modals/FileExplorerModal";
import MdPreview from "../../components/Post/MdPreview";

// Use to sync the scroll of mardown editor mode and preview mode
import SyncScroll from "../Hoc/SyncScroll";

class Edit extends Component {
    static propTypes = {
        loading: PropTypes.bool,
        post: PropTypes.object,
        history: PropTypes.object,
        manageScroll: PropTypes.func
    };

    state = {
        preview: "",
        actionDrawerOpen: false,
        fileExplorerProps: {}
    };
    
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

    toggleActionDrawer = e => {
        e.preventDefault();
        this.setState({ actionDrawerOpen: !this.state.actionDrawerOpen });
    };

    getHtml = html => {
        this.setState({ html });
    };

    toggleFileExplorerModal = props => {
        this.setState({
            fileExplorerProps: props
        });
    };

    toggleZenView = e => {
        e.preventDefault();
        document.body.classList.toggle("distract-free");
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
            <section className="module-xs">
                <div className="row">
                    <Link
                        to="#"
                        className="toggle-zenview"
                        onClick={this.toggleZenView}
                    >
                        <i className="fa fa-eye" />
                    </Link>
                    <div className="col-lg-12 distractor">
                        <PostPublish
                            edit
                            history={this.props.history}
                            post={this.props.post}
                            toggleActionDrawer={this.toggleActionDrawer}
                        />
                    </div>
                    <div className="col-lg-6 column article-holder ">
                        <ArticleEdit
                            post={this.props.post}
                            setHtml={this.setHtml}
                        />
                    </div>
                    <div className="col-lg-6 column preview distractor">
                        <MdPreview
                            post={PostActions.data}
                            preview={this.state.preview}
                        />
                    </div>
                </div>
                <PostActionDrawer
                    post={this.props.post}
                    isOpen={this.state.actionDrawerOpen}
                    toggleActionDrawer={this.toggleActionDrawer}
                    toggleFileExplorerModal={this.toggleFileExplorerModal}
                />
                {this.state.fileExplorerProps.display && (
                    <FileExplorerModal {...this.state.fileExplorerProps} />
                )}
                {this.state.actionDrawerOpen && (
                    <div
                        id="modal-backdrop"
                        onClick={this.toggleActionDrawer}
                    />
                )}
            </section>
        );
    }
}

export default GetSinglePost(SyncScroll(Edit));
