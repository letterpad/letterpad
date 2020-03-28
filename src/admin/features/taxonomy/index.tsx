import React, { useState, useEffect } from "react";
import { useQuery } from "react-apollo";
import { notify } from "react-notify-toast";
import { translate, WithNamespaces } from "react-i18next";
import styled from "styled-components";

// import Taxonomies from "./Taxonomies";
import StyledTaxonomy from "./Taxonomy.css";

import StyledSection from "../../components/section";
import Input, { TextArea } from "../../components/input";
import StyledGrid from "../../components/grid";
import { Button } from "../../components/button";
import { QUERY_TAXONOMIES } from "../../../shared/queries/Queries";
import apolloClient from "../../../shared/apolloClient";
import {
  UPDATE_TAXONOMY,
  DELETE_TAXONOMY,
} from "../../../shared/queries/Mutations";
import {
  TaxonomiesQuery,
  UpdateTaxonomyMutation,
  DeleteTaxonomyMutation,
  Taxonomy,
  TaxonomyTypes,
  TaxonomiesQueryVariables,
} from "../../../__generated__/gqlTypes";
import TaxonomyList from "./Taxonomies/TaxonomyList";

const NewTagWrapper = styled.div`
  display: flex;
  border-top: none;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--color-border);
  padding: 0 12px;
  .input-box {
    margin-bottom: 0px;
    input {
      border: none;
      flex: 1;
    }
  }
`;

const Icon = styled.i`
  color: #1a82d6;
  margin-right: 0.5rem;
  font-size: 20px;
  cursor: pointer;
`;

const texts = t => ({
  post_tag: {
    title1: t("tags.title"),
    subtitle1: t("tags.tagline"),
    title2: t("tags.create"),
    input1: t("tags.create.name.placeholder"),
    input2: t("tags.create.desc.placeholder"),
  },
  post_category: {
    title1: t("categories.title"),
    subtitle1: t("categories.tagline"),
    title2: t("categories.create"),
    input1: t("categories.create.name.placeholder"),
    input2: t("categories.create.desc.placeholder"),
  },
});

interface ITaxonomyProps extends WithNamespaces {
  type: TaxonomyTypes;
}

const Taxonomy: React.FC<ITaxonomyProps> = ({ t, type }) => {
  const defaultTexts = texts(t)[type];
  const [selectedTaxonomyIndex, setTaxonomyIndex] = useState<number>(0);
  const [newTaxonomy, setNewTaxonomy] = useState<string>("");
  const [taxonomies, setTaxonomies] = React.useState<Taxonomy[]>([]);

  const { data, loading } = useQuery<TaxonomiesQuery, TaxonomiesQueryVariables>(
    QUERY_TAXONOMIES,
    {
      variables: {
        filters: { type, active: false },
      },
    },
  );

  useEffect(() => {
    if (!loading && data && data.taxonomies && data.taxonomies.length > 0) {
      setTaxonomies(data.taxonomies);
    }
  }, [loading]);

  if (loading || !data) return null;

  const saveNewTaxonomy = async () => {
    const name = newTaxonomy.trim();

    if (!name) {
      return;
    }
    const item = {
      type,
      name,
      desc: "",
      id: 0, // creating new taxonomy
      slug: name,
    };
    const result = await updateTaxonomyFromAPI(item);
    if (result.data && result.data.updateTaxonomy.ok) {
      item.id = result.data.updateTaxonomy.id as number;
      setTaxonomies([...taxonomies, { ...item, __typename: "Taxonomy" }]);
      setNewTaxonomy("");
      setTaxonomyIndex(taxonomies.length - 1);
    }
  };

  const editSaveTaxonomy = async (id: number) => {
    const item = { ...taxonomies.find(t => t.id === id), type };

    // merge new changes into this item
    const changedItem = { ...item, ...taxonomies[selectedTaxonomyIndex] };

    const result = await updateTaxonomyFromAPI(changedItem);
    if (result && result.data) {
      if (result.data.updateTaxonomy.ok) {
        notify.show("Taxonomy Saved", "success", 3000);
      } else if (
        result.data.updateTaxonomy.errors &&
        result.data.updateTaxonomy.errors.length > 0
      ) {
        notify.show(
          result.data.updateTaxonomy.errors[0].message as string,
          "error",
          3000,
        );
      }
    }
  };

  const deleteTaxonomy = async (id: number) => {
    // delete from api
    await deleteTaxonomyFromAPI(id);
    const _taxonomies = [...taxonomies];
    _taxonomies.splice(selectedTaxonomyIndex, 1);

    let newIndex;
    if (_taxonomies.length - 1 < selectedTaxonomyIndex) {
      newIndex = 0;
    }
    setTaxonomyIndex(newIndex);
    setTaxonomies(_taxonomies);
  };

  const changeTaxonomyDetails = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string,
  ) => {
    const { value } = e.target;

    const _taxonomies = taxonomies.map((item, index) => {
      if (index === selectedTaxonomyIndex) {
        item[field] = value;
      }
      return item;
    });
    setTaxonomies(_taxonomies);
  };

  let slug: string = "",
    desc: string | null | undefined = "",
    id: number = 0,
    name: string = "";

  if (taxonomies.length > 0) {
    ({ slug, desc, id, name } = taxonomies[selectedTaxonomyIndex]);
  }
  return (
    <StyledSection
      title={defaultTexts.title1}
      subtitle={defaultTexts.subtitle1}
    >
      <StyledTaxonomy>
        <StyledGrid columns="repeat(2, minmax(300px,1fr))">
          <div className="taxonomy-list">
            <TaxonomyList
              taxonomies={taxonomies}
              setTaxonomyIndex={setTaxonomyIndex}
              selectedIndex={selectedTaxonomyIndex}
            />
            {/* <Taxonomies
              numRows={data.taxonomies.length}
              rowHeight={44}
              items={data.taxonomies || []}
              selectedIndex={selectedTaxonomyIndex}
              handleSelect={setTaxonomyIndex}
            /> */}

            <NewTagWrapper>
              <Input
                value={newTaxonomy}
                onChange={e => setNewTaxonomy(e.target.value)}
                placeholder="Add a new tag..."
                onKeyDown={e => e.keyCode === 13 && saveNewTaxonomy()}
              />
              <Button
                compact
                btnSize="xs"
                btnStyle="primary"
                onClick={saveNewTaxonomy}
              >
                <i className="fa fa-plus"></i>
              </Button>
            </NewTagWrapper>
          </div>
          <div className="taxonomy-edit">
            <Input
              label={t("common.name")}
              value={name}
              onChange={e => changeTaxonomyDetails(e, "name")}
              placeholder="Edit this field"
            />
            <Input
              label={t("common.slug")}
              placeholder="Enter a slug"
              value={
                (slug && slug.replace("/tag/", "").replace("/category/", "")) ||
                ""
              }
              onChange={e => changeTaxonomyDetails(e, "slug")}
            />
            <TextArea
              label={t("common.description")}
              placeholder={`Enter a short description about this taxonomy. This maybe used by some themes`}
              onChange={e => changeTaxonomyDetails(e, "desc")}
              value={desc || ""}
            />
            <div className="footer">
              <Button
                btnStyle="danger"
                btnSize="sm"
                onClick={() => deleteTaxonomy(id)}
              >
                <i className="fa fa-trash" />
                Delete tag
              </Button>
              <Button
                btnStyle="primary"
                btnSize="sm"
                onClick={() => editSaveTaxonomy(id)}
              >
                <i className="fa fa-save" />
                Save
              </Button>
            </div>
          </div>
        </StyledGrid>
      </StyledTaxonomy>
    </StyledSection>
  );
};

export default translate("translations")(Taxonomy);

async function updateTaxonomyFromAPI(item) {
  return await apolloClient(true).mutate<UpdateTaxonomyMutation>({
    mutation: UPDATE_TAXONOMY,
    variables: item,
  });
}
async function deleteTaxonomyFromAPI(id) {
  return await apolloClient(true).mutate<DeleteTaxonomyMutation>({
    mutation: DELETE_TAXONOMY,
    variables: {
      id,
    },
  });
}
