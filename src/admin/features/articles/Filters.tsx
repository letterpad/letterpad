import React, { useEffect } from "react";
import StyledSelect from "../../components/select";
import { translate } from "react-i18next";
import { QUERY_TAXONOMIES } from "../../../shared/queries/Queries";
import apolloClient from "../../../shared/apolloClient";
import { TaxonomyTypes, TaxonomyType } from "../../../__generated__/gqlTypes";

const Filters: React.FC<any> = ({ query, t, changeFilter }) => {
  const [taxonomies, setTaxonomies] = React.useState<any>({
    tags: [],
    categories: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const tags = await apolloClient(true).query({
        query: QUERY_TAXONOMIES,
        variables: { filters: { type: TaxonomyType.PostTag } },
      });
      const categories = await apolloClient(true).query({
        query: QUERY_TAXONOMIES,
        variables: { type: TaxonomyType.PostCategory },
      });
      setTaxonomies({
        tags: tags.data.taxonomies,
        categories: categories.data.taxonomies,
      });
    };
    fetchData();
  }, []);

  const { tags, categories } = taxonomies;
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

      <StyledSelect
        bold
        onChange={status => changeFilter("tag", status)}
        selected={query.get("tag")}
        options={[
          {
            name: "Select Tag",
            value: null,
          },
          ...tags.map(tag => {
            return { name: tag.name, value: tag.name };
          }),
        ]}
      />

      <StyledSelect
        bold
        onChange={status => changeFilter("category", status)}
        selected={query.get("category")}
        options={[
          {
            name: "Select Category",
            value: null,
          },
          ...categories.map(category => {
            return { name: category.name, value: category.name };
          }),
        ]}
      />

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

export default translate("translations")(Filters);
