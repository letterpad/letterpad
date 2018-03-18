import React from "react";
import { Link } from "react-router-dom";

const Post = ({ post, label }) => {
    return (
        <div className="col-lg-6">
            <strong>{label}:</strong>
            <br />
            <Link to={"/post/" + post.slug}>{post.title}</Link>
        </div>
    );
};

const AdjacentPosts = ({ adjacentPosts }) => {
    let prev = adjacentPosts.previous ? (
        <Post post={adjacentPosts.previous} label="Previous" />
    ) : (
        ""
    );
    let next = adjacentPosts.next ? (
        <Post post={adjacentPosts.next} label="Next" />
    ) : (
        ""
    );
    return (
        <div className="row p-t-40">
            {prev}
            {next}
        </div>
    );
};

export default AdjacentPosts;
