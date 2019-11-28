import React, { Component } from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";
import moment from "moment";
import { Link } from "react-router-dom";

import config from "../../../config";

import ArticleHoc from "./ArticleHoc";
import Search from "./Search";
import Paginate from "../../components/pagination";

import StyledToolbar, { Layout } from "./Toolbar.css";

import StyledSection from "../../components/section";
import StyledGrid from "../../components/grid";
import StyledGridItem from "../../components/grid/GridItem";
import StyledButton from "../../components/button";
import { StyledTitle, StyledItem, Table, Loader } from "./ArticleList.css";
import Filters from "./Filters";

class ArticleList extends Component {
  static propTypes = {
    posts: PropTypes.object,
    changePage: PropTypes.func,
    variables: PropTypes.object,
    loading: PropTypes.bool,
    router: PropTypes.object,
    setSelection: PropTypes.func,
    selectAllPosts: PropTypes.func,
    deleteSelectedPosts: PropTypes.func,
    searchPosts: PropTypes.func,
    fetchPosts: PropTypes.func,
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
    layout: localStorage.layout || "list",
  };

  componentDidMount() {
    document.body.classList.add("posts-page");
    if (!this.getUrlParams().get("limit")) {
      //this.changeFilter("limit", config.itemsPerPage);
    }
  }

  componentWillUnmount() {
    document.body.classList.remove("posts-page");
  }

  getUrlParams = () => {
    return new URLSearchParams(this.props.router.history.location.search);
  };

  changeFilter = (key, value) => {
    const query = this.getUrlParams();
    const filterKeys = [...query.keys()];
    if (value === null) {
      query.delete(key);
    } else if (filterKeys.includes(key)) {
      query.set(key, value);
    } else {
      query.append(key, value);
    }
    if (query.get("category") || query.get("tag") || query.get("status")) {
      query.delete("limit");
      query.delete("page");
    }

    this.props.router.history.push({
      search: "?" + query.toString(),
    });

    this.props.fetchPosts();
  };

  goToNextPage = (e, page) => {
    e.preventDefault();
    this.changeFilter("page", page);
    this.changeFilter("limit", config.itemsPerPage);
  };

  setLayout = layout => {
    this.setState({ layout });
    localStorage.layout = layout;
  };

  deletePosts = () => {};

  render() {
    const { t } = this.props;
    const { loading, type } = this.props;
    const query = new URLSearchParams(
      this.props.router.history.location.search,
    );

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
            <div className="left-block">
              <Layout selected={this.state.layout}>
                <i
                  className="fa fa-list list"
                  onClick={() => this.setLayout("list")}
                />
                <i
                  className="fa fa-th grid"
                  onClick={() => this.setLayout("grid")}
                />
              </Layout>
              <Filters query={query} changeFilter={this.changeFilter} />
              {this.props.selectedPosts.length > 0 && (
                <StyledButton basic sm onClick={this.props.deleteSelectedPosts}>
                  Delete
                </StyledButton>
              )}
            </div>
            <div className="right-block">
              <Search
                type="post"
                searchPosts={this.changeFilter}
                query={query.get("query")}
              />
            </div>
          </StyledToolbar>
          {
            <React.Fragment>
              {<Loader loading={loading} />}
              {this.state.layout === "list" ? (
                <RenderTable
                  data={(this.props.posts && this.props.posts.rows) || []}
                  setSelection={this.props.setSelection}
                />
              ) : (
                <RenderGrid
                  data={(this.props.posts && this.props.posts.rows) || []}
                  setSelection={this.props.setSelection}
                />
              )}
            </React.Fragment>
          }

          {!loading && this.props.posts && (
            <Paginate
              count={this.props.posts.count}
              page={parseInt(query.get("page")) || 1}
              changePage={this.goToNextPage}
              limit={config.itemsPerPage}
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

const RenderGrid = ({ data, setSelection }) => {
  return (
    <StyledGrid columns="repeat(auto-fit,minmax(200px,1fr))">
      {data.map(post => {
        const { categories } = filterTaxonomies(post.taxonomies);
        const authorName = post.author.fname + " " + post.author.lname;
        return (
          <StyledItem key={post.slug}>
            <div className="selection-box">
              <input
                type="checkbox"
                id={"checkbox-" + post.id}
                onClick={() => setSelection(post.id)}
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
  );
};
RenderGrid.propTypes = {
  data: PropTypes.array,
  setSelection: PropTypes.func,
};

const RenderTable = ({ data, setSelection }) => {
  return (
    <Table
      className="table"
      columns={["", "Title", "Last Updated", "Author", "Status", "Category"]}
    >
      <thead>
        <tr>
          {["", "Title", "Last Updated", "Author", "Status", "Category"].map(
            (colName, i) => (
              <th key={i}>{colName}</th>
            ),
          )}
        </tr>
      </thead>
      <tbody>
        {data.map(post => {
          const { categories } = filterTaxonomies(post.taxonomies);
          const authorName = post.author.fname + " " + post.author.lname;
          return (
            <tr key={post.slug}>
              <td className="selection-box">
                <input
                  type="checkbox"
                  id={"checkbox-" + post.id}
                  onClick={() => setSelection(post.id)}
                />
                <label htmlFor={"checkbox-" + post.id} />
              </td>
              <td>
                <Link to={"/admin/posts/" + post.id}>
                  <div className="title">{post.title}</div>
                </Link>

                <div className="small">{post.excerpt.slice(0, 60)}...</div>
              </td>
              <td className="small">
                {moment(post.createdAt).format("MMM Do YYYY")}
              </td>
              <td className="small">{authorName}</td>
              <td className={"upper status " + post.status}>
                <span>{post.status}</span>
              </td>
              <td className="small">{categories}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

RenderTable.propTypes = {
  data: PropTypes.array,
  setSelection: PropTypes.func,
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
