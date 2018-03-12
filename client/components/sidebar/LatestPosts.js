import React, { Component } from "react";
import { Link } from "react-router-dom";
import moment from "moment";

const Item = ({ style, post }) => {
    return (
        <li style={style.item}>
            <div style={style.imageWrapper}>
                <Link to={`/${post.type}/${post.slug}`}>
                    <img style={style.image} src={post.cover_image} />
                </Link>
            </div>
            <div className="content" style={style.content}>
                <Link to={`/${post.type}/${post.slug}`}>{post.title}</Link>
                <span style={style.time}>
                    {moment(post.created_at).fromNow()}
                </span>
            </div>
        </li>
    );
};

export default class LatestPosts extends Component {
    render() {
        const style = {
            item: {
                display: "flex",
                alignItems: "flex-start",
                marginBottom: 12
            },
            content: {
                display: "flex",
                flexDirection: "column",
                marginLeft: 8
            },
            imageWrapper: {
                width: 80,
                height: 60
            },
            image: {
                width: "100%",
                height: "100%",
                objectFit: "cover"
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
                            return this.props.posts.rows.map((post, i) => (
                                <Item key={i} style={style} post={post} />
                            ));
                        })()}
                    </ul>
                </div>
            </div>
        );
    }
}
