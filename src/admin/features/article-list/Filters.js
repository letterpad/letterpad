import React from "react";
import PropTypes from "prop-types";
import StyledSelect from "../../components/select";
import { translate } from "react-i18next";
import { graphql } from "@apollo/react-hoc";
import { GET_TAXONOMIES } from "../../../shared/queries/Queries";

const Filters = ({ query, t, tags, categories, changeFilter }) => {
  return (
    <div>
      <StyledSelect
        bold
        onChange={status => changeFilter("status", status)}
        selected={query.get("status") || null}
        options={[
          {
            name: t("common.all"),
            value: null,
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
      {!tags.loading && (
        <StyledSelect
          bold
          onChange={status => changeFilter("tag", status)}
          selected={query.get("tag")}
          options={[
            {
              name: "Select Tag",
              value: null,
            },
            ...tags.taxonomies.map(tag => {
              return { name: tag.name, value: tag.name };
            }),
          ]}
        />
      )}
      {!categories.loading && (
        <StyledSelect
          bold
          onChange={status => changeFilter("category", status)}
          selected={query.get("category")}
          options={[
            {
              name: "Select Category",
              value: null,
            },
            ...categories.taxonomies.map(category => {
              return { name: category.name, value: category.name };
            }),
          ]}
        />
      )}

      <StyledSelect
        bold
        onChange={sort => changeFilter("sortBy", sort)}
        selected={query.get("sortBy") || "newest"}
        options={[
          {
            name: "Newest",
            value: "newest",
          },
          {
            name: "Oldest",
            value: "oldest",
          },
        ]}
      />
    </div>
  );
};

Filters.propTypes = {
  query: PropTypes.object.isRequired,
  tags: PropTypes.object,
  categories: PropTypes.object,
  t: PropTypes.func,
  changeFilter: PropTypes.func.isRequired,
};

const CategoriesData = graphql(GET_TAXONOMIES, {
  name: "categories",
  options: () => ({ variables: { type: "post_category" } }),
});

const TagsData = graphql(GET_TAXONOMIES, {
  name: "tags",
  options: () => ({ variables: { type: "post_tag" } }),
});

export default translate("translations")(TagsData(CategoriesData(Filters)));
