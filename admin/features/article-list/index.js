import React, { Component } from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";
import moment from "moment";
import ArticleHoc from "./ArticleHoc";
import Paginate from "../../components/pagination";
// import { PostFilters } from "../../components/Post";
// import Search from "../../components/Post/Search";
import StyledSection from "../../components/section";
import StyledGrid from "../../components/grid";
import StyledGridItem from "../../components/grid/GridItem";

class ArticleList extends Component {
    static propTypes = {
        posts: PropTypes.object,
        changePage: PropTypes.func,
        variables: PropTypes.object,
        changeStatus: PropTypes.func,
        loading: PropTypes.bool,
        history: PropTypes.object,
        setSelection: PropTypes.func,
        selectAllPosts: PropTypes.func,
        deleteSelectedPosts: PropTypes.func,
        searchPosts: PropTypes.func,
        allPostsSelected: PropTypes.bool,
        selectedPosts: PropTypes.array,
        status: PropTypes.string,
        page: PropTypes.number,
        t: PropTypes.func,
        type: PropTypes.string.isRequired
    };

    state = {
        status: "publish",
        loading: true,
        posts: null
    };

    componentDidMount() {
        document.body.classList.add("posts-page");
    }

    componentWillUnmount() {
        document.body.classList.remove("posts-page");
    }

    render() {
        const { t } = this.props;
        const { loading, type } = this.props; //|| !this.props.networkStatus === 2;
        // const { status } = this.props;
        // let checked = {
        //     checked: this.props.allPostsSelected
        // };

        return (
            <StyledSection
                md
                title={type === "post" ? t("posts.title") : t("pages.title")}
                subtitle={
                    type === "post" ? t("posts.tagline") : t("pages.tagline")
                }
            >
                <div>
                    <div className="action-bar">
                        {/* <Search type="post" searchPosts={this.props.searchPosts} />*/}
                        <div className="action-delete">
                            {/*this.props.selectedPosts.length > 0 && (
                            <button
                                className="btn btn-xs btn-danger"
                                onClick={this.props.deleteSelectedPosts}
                            >
                                Delete
                            </button>
                        )*/}
                        </div>
                        {/*<PostFilters
                        changeStatus={this.props.changeStatus}
                        selectedStatus={status}
                    />*/}
                    </div>

                    {loading ? (
                        <div>loading</div>
                    ) : (
                        <StyledGrid>
                            {this.props.posts.rows.map(post => {
                                const { categories } = filterTaxonomies(
                                    post.taxonomies
                                );
                                const authorName =
                                    post.author.fname + " " + post.author.lname;
                                return (
                                    <StyledGridItem
                                        key={post.slug}
                                        image={post.cover_image}
                                        title={post.title}
                                        description={post.excerpt}
                                        href={"/admin/posts/" + post.id}
                                        line1={authorName}
                                        line2={moment(
                                            new Date(post.created_at)
                                        ).format("MMM Do YYYY")}
                                        stickyText={categories}
                                        setSelection={this.props.setSelection}
                                        selectedPosts={this.props.selectedPosts}
                                    />
                                );
                            })}
                        </StyledGrid>
                    )}

                    {!loading && (
                        <Paginate
                            count={this.props.posts.count}
                            page={this.props.page}
                            changePage={this.props.changePage}
                            limit={10}
                        />
                    )}
                </div>
            </StyledSection>
        );
    }
}

export default translate("translations")(ArticleHoc(ArticleList));

const filterTaxonomies = taxonomies => {
    const result = {
        tags: [],
        categories: []
    };

    taxonomies.forEach(tax => {
        const type = tax.type === "post_category" ? "categories" : "tags";

        result[type].push(tax.name);
    });

    result.tags = result.tags.join(", ");
    result.categories = result.categories.join(", ");
    return result;
};
