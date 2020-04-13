import {
  Post,
  TaxonomiesQuery,
  TaxonomiesQueryVariables,
  Taxonomy,
  TaxonomyType,
  TaxonomyTypes,
} from "../../../../__generated__/gqlTypes";
import React, { Component } from "react";

import PostActions from "../PostActions";
import { QUERY_TAXONOMIES } from "../../../../shared/queries/Queries";
import StyledTags from "../../../components/tags";
import apolloClient from "../../../../shared/apolloClient";

interface ITaxonomyProps {
  post: Post;
  for: TaxonomyType;
  suggestions: Taxonomy[];
  toggleVisibility: (e?: Event, flag?: boolean) => void;
}

interface ITaxonomyState {
  tags: Pick<Taxonomy, "id" | "name" | "slug">[];
  suggestions: Taxonomy[];
}

export class Taxonomies extends Component<ITaxonomyProps, ITaxonomyState> {
  static defaultProps = {
    suggestions: [],
  };

  type = TaxonomyTypes.Tags;

  state = {
    tags: [],
    loading: true,
    suggestions: [],
  };

  async componentDidMount() {
    const { data } = await apolloClient(true).query<
      TaxonomiesQuery,
      TaxonomiesQueryVariables
    >({
      query: QUERY_TAXONOMIES,
      variables: {
        filters: {
          type: this.props.for,
          active: false,
        },
      },
    });
    this.setState({ suggestions: data.taxonomies });
    const type = this.type;
    const tags = this.props.post[type].map(tax => {
      const { __typename, ...rest } = tax;
      return rest;
    });
    this.setState({ tags: formatTagsForDropdown(tags) });
  }

  filterTaxonomyByType = () => {
    return PostActions.getData()[this.props.for];
  };

  handleOnChange = (tags: Taxonomy[], a, b) => {
    if (a.action === "remove-value") {
      PostActions.removeTaxonomy(a.removedValue, this.type);

      this.setState({ tags: this.filterTaxonomyByType() });
      setTimeout(() => this.props.toggleVisibility(undefined, true), 0);
    } else if (a.action === "select-option") {
      PostActions.addTaxonomy(formatTagsForBackend([a.option])[0], this.type);
      this.setState({ tags });
    }
    PostActions.updatePost();
  };

  createNewTag = (tag: string) => {
    if (tag.trim().length === 0) return;
    const newTag = {
      id: 0,
      name: tag,
      slug: tag,
    };
    PostActions.addTaxonomy(newTag, this.type);
    this.setState({
      tags: formatTagsForDropdown([...this.state.tags, newTag]),
    });
    PostActions.updatePost();
  };

  render() {
    const name =
      this.props.for === TaxonomyType.PostTag ? "Tags" : "Categories";

    return (
      <StyledTags
        name={name}
        value={this.state.tags}
        onChange={this.handleOnChange}
        options={formatTagsForDropdown(this.state.suggestions)}
        isMulti
        isValidNewOption={inputValue => {
          return inputValue.trim().length > 0;
        }}
        closeMenuOnSelect={true}
        onCreateOption={this.createNewTag}
      />
    );
  }
}

export default Taxonomies;

const formatTagsForDropdown = (tags: Taxonomy[]) => {
  return tags.map(tag => {
    return {
      ...tag,
      label: tag.name,
      value: tag.name,
    };
  });
};

const formatTagsForBackend = (tags: Taxonomy[]) => {
  return tags.map(tag => {
    // eslint-disable-next-line no-unused-vars
    // @ts-ignore
    const { label, value, desc, __typename, type, posts, ...rest } = tag;
    return rest;
  });
};
