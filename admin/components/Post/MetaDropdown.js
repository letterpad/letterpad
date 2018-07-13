import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";

import { makeUrl } from "../../../shared/util";
import PostActions from "./PostActions";

class MetaDropdown extends Component {
    static propTypes = {
        toggleMetaDropdown: PropTypes.func,
        post: PropTypes.object,
        isOpen: PropTypes.bool,
        updatePost: PropTypes.func.isRequired
    };
    state = {
        post: this.props.post
    };

    static getDerivedStateFromProps(newProps) {
        return {
            post: newProps.post
        };
    }

    changeSlug = e => {
        this.setState({
            post: { ...this.state.post, slug: e.target.value }
        });
        PostActions.setData({ slug: this.state.post.slug });
    };

    render() {
        if (!this.props.isOpen) return null;
        const permalink = makeUrl([this.state.post.type, this.state.post.slug]);
        return (
            <div className="post-meta">
                <div className="x_content m-b-20">
                    <div className="meta-label">Published at</div>
                    <input
                        type="text"
                        className="form-control meta-value"
                        placeholder="Published date"
                        defaultValue={moment(
                            new Date(this.state.post.created_at)
                        ).format("DD-MM-Y hh:mm A")}
                    />
                </div>
                <div className="x_content m-b-20">
                    <div className="meta-label">Change Path</div>
                    <input
                        type="text"
                        className="form-control meta-value"
                        placeholder="Link to post"
                        defaultValue={this.state.post.slug}
                        onKeyUp={this.changeSlug}
                    />
                </div>
                <div className="x_content m-b-20">
                    <div className="meta-label">Preview</div>
                    <div className="meta-value">
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={permalink}
                        >
                            {permalink}
                        </a>
                    </div>
                </div>
                <hr />
                <div className="btn-item">
                    <button
                        type="submit"
                        onClick={e => {
                            this.props.updatePost(e, {});
                            this.props.toggleMetaDropdown();
                        }}
                        className={"publish-btn btn btn-sm btn-primary"}
                    >
                        Save
                    </button>
                </div>
            </div>
        );
    }
}

export default MetaDropdown;
