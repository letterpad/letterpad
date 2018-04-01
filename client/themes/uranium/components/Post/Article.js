import React, { Component } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import AdjacentPosts from "./AdjacentPosts";

export default class Article extends Component {
    render() {
        const tags = [];
        const categories = [];
        const post = this.props.post;
        post.taxonomies.forEach((taxonomy, i) => {
            if (taxonomy.type === "post_category") {
                categories.push(
                    <Link key={i} to={"/category/" + taxonomy.slug}>
                        {taxonomy.name}
                    </Link>
                );
            } else {
                tags.push(
                    <Link key={i} to={"/tag/" + taxonomy.slug}>
                        #{taxonomy.name}
                    </Link>
                );
            }
        });
        const content = post.mode == "markdown" ? post.mdPreview : post.body;
        return (
            <div>
                <div className="post-thumbnail">
                    <img
                        width="100"
                        src={post.cover_image}
                        alt={this.props.title}
                    />
                </div>
                <div className="card">
                    <article className="post">
                        <div className="post-header">
                            <h2 className="post-title font-alt">
                                <Link to="#">{post.title}</Link>
                            </h2>
                            <div className="post-meta">
                                {moment(new Date(post.created_at)).format("LL")}
                                {tags.length > 0 && (
                                    <div className="tags font-serif  p-t-30">
                                        {tags}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="post-content ql-editor fs-medium">
                            <p
                                dangerouslySetInnerHTML={{
                                    __html: content
                                }}
                            />
                        </div>
                        <div className="tags font-serif  p-t-30">
                            {categories}
                        </div>
                        {this.props.adjacentPosts && (
                            <AdjacentPosts
                                adjacentPosts={this.props.adjacentPosts}
                            />
                        )}
                    </article>
                </div>
            </div>
        );
    }
}
