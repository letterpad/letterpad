import React, { Component } from "react";
import ArticleListItem from "../components/Post/ArticleListItem";
import StackGrid from "react-stack-grid";
import Loader from "../components/Loader";
import config from "../../../../config";
import Paginate from "../components/Paginate";
import OhSnap from "../components/OhSnap";
import WithResize from "./Hoc/WithResize";
import PostsData from "shared/data-connectors/PostsData";

class Posts extends Component {
    constructor(props) {
        super(props);
        this.loadMore = this.loadMore.bind(this);
        this.page = 1;
        this.state = {
            posts: [],
            loading: true
        };
    }

    componentDidMount() {
        document.body.classList.add("posts-page");
        this.props.setResizeTracker(".post-grid");
        setTimeout(() => this.grid && this.grid.updateLayout(), 100);
    }

    componentWillUnmount() {
        document.body.classList.remove("posts-page");
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.loading && this.state.loading) {
            this.setState({ loading: false });
            this.props.setHeroDetails({
                image: nextProps.settings.banner.value,
                title: nextProps.settings.site_title.value,
                subTitle: nextProps.settings.site_tagline.value
            });
        }
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
        let gridWidth = "33.33%";
        if (windowWidth < 900) {
            gridWidth = "50%";
        }
        if (windowWidth < 600) {
            gridWidth = "100%";
        }

        const posts = (
            <div className="post-row">
                <StackGrid
                    gridRef={grid => (this.grid = grid)}
                    className="post-grid"
                    columnWidth={gridWidth}
                    gutterWidth={24}
                    gutterHeight={24}
                    enableSSR={true}
                    appearDelay={0}
                >
                    {this.props.posts.map((post, i) => {
                        return <ArticleListItem idx={i} key={i} post={post} />;
                    })}
                </StackGrid>
            </div>
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

export default PostsData(WithResize(Posts));
