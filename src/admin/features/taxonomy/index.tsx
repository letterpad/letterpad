import React, { useState, useEffect } from "react";
import { useQuery } from "react-apollo";
import { notify } from "react-notify-toast";
import { translate, WithNamespaces } from "react-i18next";

import { Flex } from "./Taxonomy.css";

import Section, { SectionSizes } from "../../components/section";
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
import TaxonomyList from "./TaxonomyList";

const texts = t => ({
  post_tag: {
    title1: t("tags.title"),
    subtitle1: t("tags.tagline"),
    title2: t("tags.create"),
    input1: t("tags.create.name.placeholder"),
    input2: t("tags.create.desc.placeholder"),
  },
});

interface ITaxonomyProps extends WithNamespaces {
  type: TaxonomyTypes;
}

const Taxonomy: React.FC<ITaxonomyProps> = ({ t, type }) => {
  const defaultTexts = texts(t)[type];
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [createMode, setCreateMode] = useState<boolean>(false);
  const [taxonomies, setTaxonomies] = React.useState<Taxonomy[]>([]);

  const onTaxonomySelect = (id: number, checked: boolean) => {
    selectedIds.push(id);
    const uniqeIDs = new Set(selectedIds);
    if (!checked) {
      uniqeIDs.delete(id);
    }
    setSelectedIds([...uniqeIDs]);
  };

  const { data, loading } = useQuery<TaxonomiesQuery, TaxonomiesQueryVariables>(
    QUERY_TAXONOMIES,
    {
      variables: {
        filters: { type, active: false },
      },
      fetchPolicy: "network-only",
    },
  );

  useEffect(() => {
    if (!loading && data && data.taxonomies && data.taxonomies.length > 0) {
      const sortedTaxonomies = data.taxonomies.sort((a, b) => {
        return a.id - b.id;
      });
      setTaxonomies(sortedTaxonomies);
    }
  }, [loading]);

  if (loading || !data) return null;

  const deleteTaxonomy = async () => {
    // TODO: Mass delete in one request
    for (let i = 0; i < selectedIds.length; i++) {
      await deleteTaxonomyFromAPI(selectedIds[i]);
    }
    const updatedTaxonomies = taxonomies.filter(
      taxonomy => !selectedIds.includes(taxonomy.id),
    );
    const sortedTaxonomies = updatedTaxonomies.sort((a, b) => {
      return a.id - b.id;
    });
    setTaxonomies(sortedTaxonomies);
    setSelectedIds([]);
  };

  const createTaxonomyHolder = () => {
    const taxonomy = {
      slug: "",
      id: 0,
      name: "",
      desc: "",
    };
    setTaxonomies([...taxonomies, { ...taxonomy }]);
    setCreateMode(true);

    setTimeout(() => {
      const inputs = document.querySelectorAll(".scroller input");
      inputs[inputs.length - 2].focus();
    }, 0);
  };

  return (
    <Section
      size={SectionSizes.md}
      title={defaultTexts.title1}
      rightToolbar={
        <Actions
          createMode={createMode}
          createTaxonomyHolder={createTaxonomyHolder}
          hasDelete={selectedIds.length > 0}
          onDelete={deleteTaxonomy}
        />
      }
      subtitle={defaultTexts.subtitle1}
    >
      <TaxonomyList
        data={taxonomies}
        onSelect={onTaxonomySelect}
        onUpdate={async item => {
          const itemWithType = { ...item, type };
          if (itemWithType.id === 0) {
            // create
            const result = await updateTaxonomy(itemWithType);
            if (result.data && result.data.updateTaxonomy.ok) {
              itemWithType.id = result.data.updateTaxonomy.id as number;
              setTaxonomies(
                taxonomies.map(item => (item.id === 0 ? itemWithType : item)),
              );
              setCreateMode(false);
              setSelectedIds([]);
              setTimeout(() => {
                const inputs = document.querySelectorAll(".scroller input");
                inputs[inputs.length - 1].focus();
              }, 0);
            } else {
              return;
            }
          } else {
            updateTaxonomy(itemWithType);
          }
        }}
      />
    </Section>
  );
};

export default translate("translations")(Taxonomy);

async function updateTaxonomy(item) {
  return await apolloClient(true).mutate<UpdateTaxonomyMutation>({
    mutation: UPDATE_TAXONOMY,
    variables: { ...item },
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

const Actions = ({ createTaxonomyHolder, hasDelete, onDelete, createMode }) => {
  return (
    <Flex>
      {hasDelete && (
        <Button btnSize="md" btnStyle="danger" onClick={onDelete}>
          Delete
        </Button>
      )}
      <Button
        btnSize="md"
        btnStyle="primary"
        onClick={createTaxonomyHolder}
        disabled={createMode}
      >
        New
      </Button>
    </Flex>
  );
};
