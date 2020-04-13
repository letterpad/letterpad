import { Flex, Loader } from "./ArticleList.css";
import { Link, RouteComponentProps } from "react-router-dom";
import { PostTypes, PostsNode } from "../../../__generated__/gqlTypes";
import React, { useState } from "react";
import Section, { SectionSizes } from "../../components/section";
import StyledToolbar, { Layout } from "./Toolbar.css";
import { WithNamespaces, translate } from "react-i18next";

import ArticleHoc from "./ArticleHoc";
import { Button } from "../../components/button";
import Filters from "./Filters";
import Paginate from "../../components/pagination";
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
}

enum FilterOptions {
  page = "page",
  limit = "limit",
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
      size={SectionSizes.md}
      title={type === "post" ? t("posts.title") : t("pages.title")}
      rightToolbar={
        <Actions
          createPost={"/admin/" + (type === "post" ? "post-new" : "page-new")}
          onDelete={deleteSelectedPosts}
          selectedPosts={selectedPosts}
        />
      }
    >
      <div>
        <StyledToolbar className="action-bar">
          <Filters query={getUrlParams()} changeFilter={changeFilter} />
        </StyledToolbar>
        {
          <React.Fragment>
            {<Loader loading={loading} />}
            <RenderTable
              data={(posts && posts.rows) || []}
              setSelection={setSelection}
              type={type}
            />
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

const Actions = ({ createPost, onDelete, selectedPosts }) => {
  return (
    <Flex>
      {/* {searchbox} */}
      {selectedPosts.length > 0 && (
        <>
          <Button btnStyle="danger" btnSize="md" onClick={onDelete}>
            Delete
          </Button>
          &nbsp; &nbsp;
        </>
      )}

      <Link to={createPost}>
        <Button btnSize="md" btnStyle="primary">
          New
        </Button>
      </Link>
    </Flex>
  );
};
