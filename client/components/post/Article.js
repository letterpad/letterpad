import React, { Component } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import AdjacentPosts from "./AdjacentPosts";

export default class Article extends Component {
    render() {
        const tags = this.props.post.taxonomies
            .filter(taxonomy => taxonomy.type === "post_category")
            .map(taxonomy => {
                return <Link to="">{taxonomy.name}</Link>;
            });

        return (
            <div className="card">
                <article className="post">
                    <div className="post-thumbnail">
                        <img
                            width="100"
                            src={this.props.post.cover_image}
                            alt={this.props.title}
                        />
                    </div>
                    <div className="post-header">
                        <h2 className="post-title font-alt">
                            <Link to={"/"}>{this.props.post.title}</Link>
                        </h2>
                        <div className="post-meta">
                            {moment(
                                new Date(this.props.post.created_at)
                            ).format("LL")}
                        </div>
                    </div>
                    <div className="post-content ql-editor">
                        <p
                            dangerouslySetInnerHTML={{
                                __html: this.props.post.body
                            }}
                        />
                    </div>
                    <div className="tags font-serif  p-t-30">{tags}</div>
                    {this.props.adjacentPosts && (
                        <AdjacentPosts
                            adjacentPosts={this.props.adjacentPosts}
                        />
                    )}
                </article>
            </div>
        );
    }
}
