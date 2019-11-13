import React, { Component } from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";
import moment from "moment";
import { Link } from "react-router-dom";

import config from "../../../config";

import ArticleHoc from "./ArticleHoc";
import Search from "./Search";
import Paginate from "../../components/pagination";

import StyledToolbar from "./Toolbar.css";

import StyledSection from "../../components/section";
import StyledGrid from "../../components/grid";
import StyledGridItem from "../../components/grid/GridItem";
import StyledSelect from "../../components/select";
import StyledButton from "../../components/button";
import { StyledTitle, StyledItem } from "./ArticleList.css";

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
    type: PropTypes.string.isRequired,
  };

  state = {
    status: "publish",
    loading: true,
    posts: null,
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
        title={
          <Title
            title={type === "post" ? t("posts.title") : t("pages.title")}
            creationLink={"/admin/" + type === "post" ? "post-new" : "page-new"}
          />
        }
        subtitle={type === "post" ? t("posts.tagline") : t("pages.tagline")}
      >
        <div>
          <StyledToolbar className="action-bar">
            <div className="action-delete">
              <StyledSelect
                bold
                onChange={this.props.changeStatus}
                selected="publish"
                options={[
                  {
                    name: t("common.all"),
                    value: "all",
                  },
                  {
                    name: t("common.published"),
                    value: "publish",
                  },
                  {
                    name: t("common.drafts"),
                    value: "draft",
                  },
                  {
                    name: t("common.deleted"),
                    value: "trash",
                  },
                ]}
              />
              {this.props.selectedPosts.length > 0 && (
                <StyledButton
                  danger
                  sm
                  onClick={this.props.deleteSelectedPosts}
                >
                  Delete
                </StyledButton>
              )}
            </div>
            <div className="right-block">
              <Search type="post" searchPosts={this.props.searchPosts} />
            </div>
          </StyledToolbar>

          {loading ? (
            <div>loading</div>
          ) : (
            <StyledGrid columns="repeat(auto-fit,minmax(200px,1fr))">
              {this.props.posts.rows.map(post => {
                const { categories } = filterTaxonomies(post.taxonomies);
                const authorName = post.author.fname + " " + post.author.lname;
                return (
                  <StyledItem key={post.slug}>
                    <div className="selection-box">
                      <input
                        type="checkbox"
                        id={"checkbox-" + post.id}
                        onClick={() => this.props.setSelection(post.id)}
                      />
                      <label htmlFor={"checkbox-" + post.id} />
                    </div>
                    <StyledGridItem
                      image={getCoverImage(post.cover_image)}
                      title={post.title}
                      description={post.excerpt}
                      href={"/admin/posts/" + post.id}
                      line1={authorName}
                      line2={moment(post.createdAt).format("MMM Do YYYY")}
                      stickyText={categories}
                    />
                  </StyledItem>
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

const Title = ({ title, creationLink }) => {
  return (
    <StyledTitle>
      <span>{title}</span>
      <Link to={creationLink}>New</Link>
    </StyledTitle>
  );
};

Title.propTypes = {
  title: PropTypes.string,
  creationLink: PropTypes.string,
};

const filterTaxonomies = taxonomies => {
  const result = {
    tags: [],
    categories: [],
  };

  taxonomies.forEach(tax => {
    const type = tax.type === "post_category" ? "categories" : "tags";

    result[type].push(tax.name);
  });

  result.tags = result.tags.join(", ");
  result.categories = result.categories.join(", ");
  return result;
};

function getCoverImage(cover_image) {
  return cover_image ? config.baseName + cover_image : "/admin/images/post.png";
}
