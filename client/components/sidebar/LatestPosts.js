import React, { Component } from "react";
import { Link } from "react-router-dom";
import moment from "moment";

export default class LatestPosts extends Component {
    render() {
        const style = {
            item: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline"
            },
            time: {
                fontSize: 12
            }
        };
        return (
            <div className="card">
                <div className="module-title">Latest Posts</div>
                <div className="x_content">
                    <ul>
                        {(() => {
                            if (this.props.loading) {
                                return <div>Loading...</div>;
                            }
                            return this.props.posts.rows.map((post, i) => {
                                return (
                                    <li key={i} style={style.item}>
                                        <Link to={`/${post.type}/${post.slug}`}>
                                            {post.title}
                                        </Link>
                                        <span style={style.time}>
                                            {moment(post.created_at).fromNow()}
                                        </span>
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
