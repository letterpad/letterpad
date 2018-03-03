import React, { Component } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import LazyLoad from "./LazyLoad";

class ArticleList extends Component {
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
                                src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLBQ0FFRUNBQ8IDRUNFBoWFhQRExMYHCggGBolGx8TITEhJSkrLi4uFx8zODMsNygtLisBCgoKBQUFDgUFDisZExkrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIAIEBhQMBIgACEQEDEQH/xAAWAAEBAQAAAAAAAAAAAAAAAAAAAQX/xAAYEAEAAwEAAAAAAAAAAAAAAAAAITFBAf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwDSvsgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAmqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/Z"
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

export default LazyLoad(ArticleList);
