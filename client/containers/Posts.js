import React, { Component } from "react";
import ArticleList from "../components/Post/ArticleList";
import { graphql } from "react-apollo";
import StackGrid from "react-stack-grid";
import Loader from "../components/Loader";
import { CAT_POSTS } from "../../shared/queries/Queries";
import config from "../../config";
import Paginate from "../components/Paginate";
import OhSnap from "../components/OhSnap";
import WithResize from "./Hoc/WithResize";

class Posts extends Component {
    constructor(props) {
        super(props);
        this.loadMore = this.loadMore.bind(this);
        this.page = 1;
        this.state = {
            posts: []
        };
    }

    componentDidMount() {
        this.props.setResizeTracker(".post-grid");
    }

    async loadMore(num) {
        let result = await this.props.fetchMore({
            type: "post_category",
            slug: this.props.slug || this.props.match.params.slug,
            postType: "post",
            limit: config.itemsPerPage,
            offset: (num - 1) * config.itemsPerPage
        });
        this.page = num;
    }

    render() {
        if (this.props.loading) {
            return <Loader />;
        }
        if (!this.props.posts) {
            return (
                <OhSnap message={this.props.settings.search_notFound.value} />
            );
        }
        if (this.props.posts.length === 0) {
            return (
                <OhSnap message={this.props.settings.text_posts_empty.value} />
            );
        }
        let windowWidth = this.props.clientWidth;
        let gridWidth = "50%";
        if (windowWidth < 600) {
            gridWidth = "100%";
        }

        const posts =
            this.props.settings.post_display.value == "row" ? (
                <div className="post-row">
                    {this.props.posts.map((post, i) => {
                        return <ArticleList idx={i} key={i} post={post} />;
                    })}
                </div>
            ) : (
                <StackGrid
                    className="post-grid"
                    columnWidth={gridWidth}
                    gutterWidth={12}
                    gutterHeight={12}
                    enableSSR={true}
                    duration={0}
                    appearDelay={0}
                >
                    {this.props.posts.map((post, i) => {
                        return <ArticleList idx={i} key={i} post={post} />;
                    })}
                </StackGrid>
            );

        return (
            <Paginate
                data={posts}
                count={this.props.total}
                page={this.page}
                loadMore={this.loadMore}
            />
        );
    }
}

export default WithResize(Posts);
