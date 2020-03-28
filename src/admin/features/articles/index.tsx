import { Link, RouteComponentProps } from "react-router-dom";
import { Loader, StyledTitle } from "./ArticleList.css";
import { PostTypes, PostsNode } from "../../../__generated__/gqlTypes";
import React, { useState } from "react";
import Section, { SectionSizes } from "../../components/section";
import StyledToolbar, { Layout } from "./Toolbar.css";
import { WithNamespaces, translate } from "react-i18next";

import ArticleHoc from "./ArticleHoc";
import { Button } from "../../components/button";
import Filters from "./Filters";
import Paginate from "../../components/pagination";
import RenderGrid from "./RenderGrid";
import RenderTable from "./RenderTable";
import Search from "./Search";
import config from "../../../config";

interface IArticleListProps extends WithNamespaces {
  type: PostTypes;
  router: RouteComponentProps;
  fetchPosts: () => void;
  setSelection: (id: string) => void;
  deleteSelectedPosts: () => void;
  selectedPosts: string[];
  loading: boolean;
  posts: PostsNode;
}

export enum LayoutOptions {
  list = "list",
  grid = "grid",
}

enum FilterOptions {
  page = "page",
  limit = "limit",
  category = "category",
  tag = "tag",
  status = "status",
  sortBy = "sortBy",
  query = "query",
}

const Articles: React.FC<IArticleListProps> = ({
  type,
  t,
  router,
  fetchPosts,
  selectedPosts,
  deleteSelectedPosts,
  loading,
  posts,
  setSelection,
}) => {
  const [layout, setLayout] = useState<LayoutOptions>(
    localStorage.layout || LayoutOptions.list,
  );

  const getUrlParams = () => {
    return new URLSearchParams(router.history.location.search);
  };

  const goToNextPage = (e, page) => {
    e.preventDefault();
    changeFilter(FilterOptions.page, page);
    changeFilter(FilterOptions.limit, config.itemsPerPage);
  };

  const changeFilter = (key: FilterOptions, value) => {
    const query = getUrlParams();
    const filterKeys = [...query.keys()];
    if (value === null) {
      query.delete(FilterOptions[key]);
    } else if (filterKeys.includes(FilterOptions[key])) {
      query.set(FilterOptions[key], value);
    } else {
      query.append(FilterOptions[key], value);
    }
    if (
      query.get(FilterOptions.category.toString()) ||
      query.get(FilterOptions.tag.toString()) ||
      query.get(FilterOptions.status.toString())
    ) {
      query.delete(FilterOptions.limit.toString());
      query.delete(FilterOptions.page.toString());
    }

    router.history.push({
      search: "?" + query.toString(),
    });

    fetchPosts();
  };

  return (
    <Section
      size={SectionSizes.xs}
      title={
        <Title
          title={type === "post" ? t("posts.title") : t("pages.title")}
          creationLink={"/admin/" + (type === "post" ? "post-new" : "page-new")}
        />
      }
      subtitle={type === "post" ? t("posts.tagline") : t("pages.tagline")}
    >
      <div>
        <StyledToolbar className="action-bar">
          <div className="left-block">
            <Layout selected={layout}>
              <i
                className="fa fa-list list"
                onClick={() => setLayout(LayoutOptions.list)}
              />
              <i
                className="fa fa-th grid"
                onClick={() => setLayout(LayoutOptions.grid)}
              />
            </Layout>
            <Filters query={getUrlParams()} changeFilter={changeFilter} />
            {selectedPosts.length > 0 && (
              <Button
                btnStyle="danger"
                btnSize="xs"
                onClick={deleteSelectedPosts}
              >
                <i className="fa fa-trash" />
                Delete
              </Button>
            )}
          </div>
          <div className="right-block">
            <Search
              type="post"
              searchPosts={changeFilter}
              query={getUrlParams().get("query")}
            />
          </div>
        </StyledToolbar>
        {
          <React.Fragment>
            {<Loader loading={loading} />}
            {layout === LayoutOptions.list && (
              <RenderTable
                data={(posts && posts.rows) || []}
                setSelection={setSelection}
              />
            )}

            {layout === LayoutOptions.grid && (
              <RenderGrid
                data={(posts && posts.rows) || []}
                setSelection={setSelection}
              />
            )}
          </React.Fragment>
        }

        {!loading && posts && (
          <Paginate
            count={posts.count}
            page={parseInt(getUrlParams().get("page") || "1")}
            changePage={goToNextPage}
            limit={config.itemsPerPage}
          />
        )}
      </div>
    </Section>
  );
};

export default translate("translations")(ArticleHoc(Articles));

const Title = ({ title, creationLink }) => {
  return (
    <StyledTitle>
      <span>{title}</span>
      <Link to={creationLink}>
        <Button btnSize="md" btnStyle="primary">
          <i className="fa fa-plus" />
          New
        </Button>
      </Link>
    </StyledTitle>
  );
};
