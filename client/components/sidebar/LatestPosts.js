import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class LatestPosts extends Component {
    render() {
        return (
            <div className="card">
                <div className="module-title">Latest Posts</div>
                <div className="x_content">
                    <ul style={{ "padding-left": "16px" }}>
                        {(() => {
                            if (this.props.loading) {
                                return <div>Loading...</div>;
                            }
                            return this.props.posts.rows.map((post, i) => {
                                return (
                                    <li key={i}>
                                        <Link to={`/${post.type}/${post.slug}`}>
                                            {post.title}
                                        </Link>
                                    </li>
                                );
                            });
                        })()}
                    </ul>
                </div>
            </div>
        );
    }
}
