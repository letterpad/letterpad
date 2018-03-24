import React, { Component } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import LazyLoad from "./LazyLoad";

class ArticleListItem extends Component {
    render() {
        let href = `/${this.props.post.type}/${this.props.post.slug}`;

        return (
            <article className="post-card post post-status-published">
                <Link className="post-card-image-link" to={href}>
                    <div
                        className="post-card-image"
                        style={{
                            backgroundImage:
                                "url(" + this.props.post.cover_image + ")"
                        }}
                    />
                </Link>

                <div className="post-card-content">
                    <Link className="post-card-content-link" to={href}>
                        <header className="post-card-header">
                            <h2 className="post-card-title">
                                {this.props.post.title}
                            </h2>
                        </header>

                        <section className="post-card-excerpt">
                            <p>{this.props.post.excerpt}</p>
                        </section>
                    </Link>
                    <footer className="post-card-meta">
                        <img
                            className="author-profile-image"
                            src={this.props.post.author.avatar}
                            alt="Cory LaViska"
                        />

                        <a href="/author/claviska" className="post-card-author">
                            {this.props.post.author.fname}
                        </a>
                    </footer>
                </div>
            </article>
        );

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
