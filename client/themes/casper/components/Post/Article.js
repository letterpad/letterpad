import React, { Component } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import AdjacentPosts from "./AdjacentPosts";

export default class Article extends Component {
    render() {
        const tags = [],
            categories = [];
        this.props.post.taxonomies.forEach((taxonomy, i) => {
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

        return (
            <article className="post-full post">
                <header className="post-full-header">
                    <section className="post-full-meta">
                        <time className="post-full-meta-date">
                            {moment(
                                new Date(this.props.post.created_at)
                            ).format("LL")}
                        </time>
                    </section>
                    <h1 className="post-full-title">{this.props.post.title}</h1>
                </header>
                <figure
                    className="post-full-image"
                    style={{
                        backgroundImage: `url(${this.props.post.cover_image})`
                    }}
                />
                <section className="post-full-content">
                    <p
                        dangerouslySetInnerHTML={{
                            __html: this.props.post.body
                        }}
                    />
                </section>
                <footer class="post-full-footer">
                    <section class="author-card">
                        <img
                            class="author-profile-image"
                            src={this.props.post.author.avatar}
                            alt={this.props.post.author.fname}
                        />

                        <section class="author-card-content">
                            <h4 class="author-card-name">
                                <a href="/author/claviska">
                                    {this.props.post.author.fname}
                                </a>
                            </h4>

                            <p>Some stuff about the author</p>
                        </section>
                    </section>
                </footer>
            </article>
        );

        return (
            <div>
                <div className="post-thumbnail">
                    <img
                        width="100"
                        src={this.props.post.cover_image}
                        alt={this.props.title}
                    />
                </div>
                <div className="card">
                    <article className="post">
                        <div className="post-header">
                            <h2 className="post-title font-alt">
                                <Link to="#">{this.props.post.title}</Link>
                            </h2>
                            <div className="post-meta">
                                {moment(
                                    new Date(this.props.post.created_at)
                                ).format("LL")}
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
                                    __html: this.props.post.body
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
