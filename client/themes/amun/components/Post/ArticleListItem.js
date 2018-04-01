import React, { Component } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import LazyLoad from "./LazyLoad";

class ArticleListItem extends Component {
    render() {
        let href = `/${this.props.post.type}/${this.props.post.slug}`;
        return (
            <div>
                {this.props.post.cover_image && (
                    <div className="post-thumbnail">
                        <Link to={href}>
                            <img
                                className="lazy-image"
                                data-src={this.props.post.cover_image}
                                alt={this.props.title}
                                src="/uploads/loading.jpg"
                            />
                        </Link>
                    </div>
                )}
                <div className="card">
                    <article className="post">
                        <div className="post-header">
                            <h2 className="post-title font-alt">
                                <Link to={href}>{this.props.post.title}</Link>
                            </h2>
                            <div className="post-meta">
                                {moment(
                                    new Date(this.props.post.created_at)
                                ).format("LL")}
                            </div>
                        </div>
                        <div className="post-content">
                            <p>{this.props.post.excerpt}</p>
                            <Link className="post-more" to={href}>
                                Read more
                            </Link>
                        </div>
                    </article>
                </div>
            </div>
        );
    }
}

export default LazyLoad(ArticleListItem);
