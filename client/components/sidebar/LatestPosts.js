import React, { Component } from "react";
import { Link } from "react-router";

export default class LatestPosts extends Component {
    render() {
        return (
            <aside id="ajaxtown_post_widget" className="widget">
                <h3 className="widget-title">Latest Posts</h3>
                <div className="latest-posts-widget">
                    <ul>
                        {(() => {
                            if (this.props.loading) {
                                return <div>Loading...</div>;
                            } else {
                                return this.props.posts.map((post, i) => {
                                    return (
                                        <li key={i}>
                                            <Link
                                                to={
                                                    `/${post.type}/${post.permalink}`
                                                }
                                            >
                                                {post.title}
                                            </Link>
                                        </li>
                                    );
                                });
                            }
                        })()}
                    </ul>
                </div>
            </aside>
        );
    }
}
