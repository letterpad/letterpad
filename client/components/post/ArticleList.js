import React, { Component } from "react";
import moment from "moment";

export default class ArticleList extends Component {
    render() {
        return (
            <article className="post-article post">
                <header className="entry-header">
                    <div className="entry-category">
                        {(() => {
                            return this.props.post.taxonomies
                                .filter(taxonomy => {
                                    return taxonomy.type == "post_category";
                                })
                                .map(taxonomy => {
                                    return (
                                        <a href="" rel="category tag">
                                            {taxonomy.name}
                                        </a>
                                    );
                                });
                        })()}
                    </div>
                    <div className="entry-meta">
                        <span className="posted-on">
                            <span className="entry-date published updated">
                                <i
                                    className="fa fa-calendar"
                                    aria-hidden="true"
                                />
                                {moment(new Date(
                                    this.props.post.created_at
                                )).format("DD-MM-YYYY")}
                            </span>
                        </span>
                        <span>&nbsp;·&nbsp;</span>
                        <span className="read-time">
                            <i className="fa fa-clock-o" aria-hidden="true" />
                            &nbsp;&nbsp; 2 min read
                        </span>
                        <span className="clear" />
                    </div>
                    <h2 className="entry-title">
                        <a href="" rel="bookmark">
                            {this.props.post.title}
                        </a>
                    </h2>
                </header>
                <div className="featured-image">
                    <a href="" title="" data-content="">
                        <img
                            src={this.props.post.cover_image}
                            alt="A woman reading"
                        />
                    </a>
                </div>
                <div className="entry-content">
                    <p
                        dangerouslySetInnerHTML={{
                            __html: this.props.post.body
                        }}
                    />
                </div>
                <footer className="entry-footer inner-article-footer">
                    <span className="read-more">
                        <a href="" className="text-line">
                            <span>Continue Reading</span>
                        </a>
                    </span>
                    <div className="social">
                        <span className="share likes fleft">
                            <a href="">
                                <i
                                    className="fa fa-heart-o"
                                    aria-hidden="true"
                                />
                            </a>
                            &nbsp;&nbsp;11
                        </span>
                        <span className="comments fright">
                            {" "}10 responses &nbsp;&nbsp;
                            <a href="">
                                <i
                                    className="fa fa-comment-o"
                                    aria-hidden="true"
                                />
                            </a>
                        </span>
                    </div>
                    <div className="clear" />
                </footer>
            </article>
        );
    }
}
