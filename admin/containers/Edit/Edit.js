import React, { Component } from "react";
import PropTypes from "prop-types";
import {
    ArticleEdit,
    PostPublish,
    PostActions,
    PostActionDrawer
} from "../../components/Post";
import { Link } from "react-router-dom";
import OhSnap from "./OhSnap";
import Loader from "../../components/Loader";
import GetSinglePost from "../../data-connectors/GetSinglePost";
import FileExplorerModal from "../../components/Modals/FileExplorerModal";
import MdPreview from "../../components/Post/MdPreview";

const qs = handle => document.querySelector(handle);

class Single extends Component {
    constructor(props) {
        super(props);
        this.getHtml = this.getHtml.bind(this);
        this.addScrollTimer = this.addScrollTimer.bind(this);
        this.toggleActionDrawer = this.toggleActionDrawer.bind(this);
        this.toggleFileExplorerModal = this.toggleFileExplorerModal.bind(this);
        this.toggleZenView = this.toggleZenView.bind(this);
        this.handlePostChanges = this.handlePostChanges.bind(this);
        this.mounted = true;
        this.state = {
            preview: "",
            actionDrawerOpen: false,
            fileExplorerProps: {}
        };
    }

    componentWillMount() {
        window.addEventListener("onPostChange", this.handlePostChanges);
    }

    componentDidMount() {
        document.body.classList.add("edit-post-page");
    }

    componentWillUnmount() {
        document.body.classList.remove("edit-post-page");
        window.removeEventListener("onPostChange", this.handlePostChanges);
    }

    handlePostChanges(e) {
        if (PostActions.data.mode == "markdown") {
            this.addScrollTimer();
            if ("mdPreview" in e.detail) {
                this.setState({ preview: e.detail.mdPreview });
            }
        } else {
            this.setState({ preview: "" });
        }
    }

    toggleActionDrawer(e) {
        e.preventDefault();
        this.setState({ actionDrawerOpen: !this.state.actionDrawerOpen });
    }

    addScrollTimer() {
        setTimeout(() => {
            var $divs = [
                qs(".article-holder .CodeFlask__textarea"),
                qs(".preview .post-content")
            ];
            document.addEventListener(
                "scroll",
                e => {
                    $divs.forEach(div => {
                        if (e.target === div) {
                            this.adjustScroll(e);
                        }
                    });
                },
                true
            );
        }, 1000);
    }
    adjustScroll(event) {
        const $divs = [
            qs(".article-holder .CodeFlask__textarea"),
            qs(".preview .post-content")
        ];
        let $allowed = $divs;
        const sync = e => {
            const $this = e.target;
            if ($allowed.indexOf($this) >= 0) {
                var other = $divs.filter(div => div !== $this)[0],
                    percentage =
                        $this.scrollTop /
                        ($this.scrollHeight - $this.offsetHeight);

                other.scrollTop = Math.round(
                    percentage * (other.scrollHeight - other.offsetHeight)
                );

                $allowed = e.target;
            } else {
                $allowed = $divs;
            }

            return false;
        };
        sync(event);
    }

    getHtml(html) {
        this.setState({ html });
    }
    toggleFileExplorerModal(props) {
        this.setState({
            fileExplorerProps: props
        });
    }
    toggleZenView(e) {
        e.preventDefault();
        document.body.classList.toggle("distract-free");
    }
    render() {
        if (this.props.loading) {
            return <Loader />;
        }
        if (!this.props.post) {
            return (
                <OhSnap message="I am not sure how this happened. Maybe this page is dead for good or restricted." />
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
            </section>
        );
    }
}

Single.propTypes = {
    loading: PropTypes.bool,
    post: PropTypes.object,
    history: PropTypes.object
};

export default GetSinglePost(Single);
