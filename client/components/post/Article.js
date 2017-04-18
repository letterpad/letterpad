import React, { Component } from "react";
import { Link } from "react-router";
import moment from "moment";

export default class ArticleList extends Component {
    render() {
        return (
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
                        <Link to={"/"}>
                            {this.props.post.title}
                        </Link>
                    </h2>
                    <div className="post-meta">
                        {moment(new Date(this.props.post.created_at)).format(
                            "LL"
                        )}
                    </div>
                </div>
                <div className="post-content ql-editor">
                    <p
                        dangerouslySetInnerHTML={{
                            __html: this.props.post.body
                        }}
                    />
                </div>
                <div className="tags font-serif  p-t-30">
                    {(() => {
                        return this.props.post.taxonomies
                            .filter(taxonomy => {
                                return taxonomy.type == "post_category";
                            })
                            .map(taxonomy => {
                                return (
                                    <Link>
                                        {taxonomy.name}
                                    </Link>
                                );
                            });
                    })()}
                </div>
                <div>
                    Previous:{" "}
                    <Link to={"/post/" + this.props.adjacentPosts[0].permalink}>
                        {this.props.adjacentPosts[0].title}
                    </Link>
                    Next:{" "}
                    <Link to={"/post/" + this.props.adjacentPosts[1].permalink}>
                        {this.props.adjacentPosts[1].title}
                    </Link>
                </div>
            </article>
        );
    }
}
