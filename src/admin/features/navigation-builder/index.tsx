import React, { useEffect, useState } from "react";
import { notify } from "react-notify-toast";
import { translate, WithNamespaces } from "react-i18next";

import Loader from "../../components/loader";
import NavigationTreeBuilder from "./NavigationTreeBuilder";

import { QUERY_TAXONOMIES, QUERY_POSTS } from "../../../shared/queries/Queries";

import StyledSection from "../../components/section";
import StyledButton from "../../components/button";
import {
  TaxonomiesQuery,
  Taxonomy,
  TaxonomiesQueryVariables,
} from "../../../__generated__/gqlTypes";
import { useQuery } from "react-apollo";
import {
  Post,
  PostsQuery,
  Setting,
  TaxonomyTypes,
  PostTypes,
  PostStatusOptions,
  SettingOptions,
} from "../../../__generated__/gqlTypes";
import apolloClient from "../../../shared/apolloClient";
import { UPDATE_OPTIONS } from "../../../shared/queries/Mutations";

interface INavigationBuilderProps extends WithNamespaces {
  settings: { [option in SettingOptions]: Setting };
}

// type that the internal state accepts
type TypeUpdatedOptions = { [option in keyof typeof SettingOptions]?: string };

// Type that the api expects
type TypeAPIUpdatedOptions = { option: SettingOptions; value: string };

const NavigationBuilder: React.FC<INavigationBuilderProps> = ({
  t,
  settings,
}) => {
  const [categories, setCategories] = useState<Taxonomy[]>([]);
  const [pages, setPages] = useState<Post[] | []>([]);

  const [updatedOptions, setUpdatedOptions] = useState<TypeUpdatedOptions>({});

  const categoriesData = useQuery<TaxonomiesQuery, TaxonomiesQueryVariables>(
    QUERY_TAXONOMIES,
    {
      variables: {
        filters: {
          type: TaxonomyTypes.PostCategory,
        },
      },
    },
  );
  const pagesData = useQuery<PostsQuery>(QUERY_POSTS, {
    variables: {
      filters: { type: PostTypes.Page, status: PostStatusOptions.Publish },
    },
  });

  useEffect(() => {
    const { loading, data } = categoriesData;
    if (!loading && data && data.taxonomies && data.taxonomies.length > 0) {
      setCategories(data.taxonomies);
    }
  }, [categoriesData.loading]);

  useEffect(() => {
    const { loading, data } = pagesData;
    if (!loading && data && data.posts && data.posts.rows.length > 0) {
      setPages(data.posts.rows);
    }
  }, [pagesData.loading]);

  const setOption = (option: SettingOptions, value: string) => {
    const newUpdates = { ...updatedOptions, [option]: value };
    setUpdatedOptions(newUpdates);
  };

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const settings: TypeAPIUpdatedOptions[] = [];
    Object.keys(updatedOptions).forEach(option => {
      settings.push({
        option: SettingOptions.Menu,
        value: updatedOptions[option],
      });
    });
    await apolloClient(true).mutate({
      mutation: UPDATE_OPTIONS,
      variables: {
        options: settings,
      },
    });
    notify.show("Navigation menu saved", "success", 3000);
  };
  if (categoriesData.loading || pagesData.loading) {
    return <Loader />;
  }
  return (
    <StyledSection title={t("menu.title")} subtitle={t("menu.tagline")}>
      <div>
        <NavigationTreeBuilder
          data={settings}
          pages={pages}
          categories={categories}
          updateOption={setOption}
        />
        <StyledButton success onClick={submitData}>
          {t("common.save")}
        </StyledButton>
      </div>
    </StyledSection>
  );
};

export default translate("translations")(NavigationBuilder);
