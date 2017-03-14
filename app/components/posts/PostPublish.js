import React, { Component } from "react";

export default class PostActions extends Component {

    updatePost(e, data) {
        e.preventDefault();
        this.props.updatePost(data);
    }

    render() {
        return (
            <div className="x_panel">
                <div className="x_title">
                    <h2>Publish</h2>
                    <div className="clearfix" />
                </div>
                <div className="x_content">
                    <h5 className="buffer-bottom">Status: { this.props.post.status }</h5>

                    <button
                        id="post-btn-publish"
                        name="btn-publish"
                        type="submit"
                        onClick={(e) => this.updatePost(e,{status: 'publish'})}
                        className="btn btn-sm btn-primary col-xs-12"
                    >
                        Publish
                    </button>
                    <br className="clear" />
                    <div className="divider-dashed" />
                    <button
                        id="post-btn-preview"
                        name="btn-preview"
                        type="submit"
                        className="btn btn-sm btn-default pull-left"
                    >
                        Preview
                    </button>
                    <button
                        id="post-btn-draft"
                        name="btn-draft"
                        type="submit"
                        onClick={(e) => this.updatePost(e,{status: 'draft'})}
                        className="btn btn-sm btn-default pull-right"
                    >
                        Save Draft
                    </button>
                    <br className="clear" />
                    <div className="divider-dashed" />
                    <a href="#" onClick={(e) => this.updatePost(e, {status: 'deleted'})} name="btn-trash" type="submit" className="text-danger text-bold">
                        Move to Trash
                    </a>

                </div>
            </div>
        );
    }
}