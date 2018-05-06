import React, { Component } from "react";
import { notify } from "react-notify-toast";
import PostActions from "./PostActions";
import { gql, graphql } from "react-apollo";
import moment from "moment";
import config from "../../../config";
import { makeUrl } from "../../../shared/util";

class PostMeta extends Component {
    constructor(props) {
        super(props);

        this.changeSlug = this.changeSlug.bind(this);
        this.state = {
            post: this.props.post,
            published: 0
        };
    }

    changeSlug(e) {
        this.state.post.slug = e.target.value;
        this.setState(this.state);
        PostActions.setData({ slug: this.state.post.slug });
    }

    render() {
        const permalink = makeUrl([this.state.post.type, this.state.post.slug]);
        return (
            <div className="card post-meta">
                <div className="x_content m-b-20">
                    <label className="custom-label">
                        <i className="fa fa fa-calendar" /> Published at
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Published date"
                        defaultValue={moment(
                            new Date(this.state.post.created_at)
                        ).format("DD-MM-Y hh:mm A")}
                    />
                </div>
                <div className="x_content m-b-20">
                    <label className="custom-label">
                        <i className="fa fa fa-link" /> Slug
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Slug"
                        defaultValue={this.state.post.slug}
                        onBlur={this.changeSlug}
                    />
                </div>
                <div className="x_content m-b-20">
                    <label className="custom-label">
                        <i className="fa fa fa-link" /> Permalink
                    </label>
                    <div>
                        <a target="_blank" href={permalink}>
                            {"/" +
                                this.state.post.type +
                                "/" +
                                this.state.post.slug}
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}

export default PostMeta;
