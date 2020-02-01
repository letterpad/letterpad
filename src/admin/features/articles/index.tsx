import React, { useState } from "react";
import { translate, WithNamespaces } from "react-i18next";
import { Link, RouteComponentProps } from "react-router-dom";
import config from "../../../config";
import ArticleHoc from "./ArticleHoc";
import Search from "./Search";
import Paginate from "../../components/pagination";
import StyledToolbar, { Layout } from "./Toolbar.css";
import Section, { SectionSizes } from "../../components/section";
import { StyledTitle, Loader } from "./ArticleList.css";
import StyledButton from "../../components/button";
import Filters from "./Filters";
import RenderTable from "./RenderTable";
import RenderGrid from "./RenderGrid";
import { PostTypes, PostNode } from "../../../__generated__/gqlTypes";

interface IArticleListProps extends WithNamespaces {
  type: PostTypes;
  router: RouteComponentProps;
  fetchPosts: () => void;
  setSelection: (id: string) => void;
  deleteSelectedPosts: () => void;
  selectedPosts: string[];
  loading: boolean;
  posts: PostNode;
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
      size={SectionSizes.md}
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
              <StyledButton basic sm onClick={deleteSelectedPosts}>
                Delete
              </StyledButton>
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
      <Link to={creationLink}>New</Link>
    </StyledTitle>
  );
};

export const filterTaxonomies = taxonomies => {
  const result: any = {
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
