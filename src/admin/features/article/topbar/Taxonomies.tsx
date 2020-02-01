import React, { Component } from "react";
import StyledTags from "../../../components/tags";
import { QUERY_TAXONOMIES } from "../../../../shared/queries/Queries";
import PostActions from "../PostActions";
import {
  Post,
  TaxonomyTypes,
  TaxonomiesQuery,
  TaxonomiesQueryVariables,
  Taxonomy,
} from "../../../../__generated__/gqlTypes";
import apolloClient from "../../../../shared/apolloClient";

interface ITaxonomyProps {
  post: Post;
  for: TaxonomyTypes;
  suggestions: [];
}

interface ITaxonomyState {
  tags:
    | {
        id: number;
        name: string;
        type: TaxonomyTypes;
        slug: string;
      }[]
    | [];
  suggestions: Taxonomy[];
}

export class Taxonomies extends Component<ITaxonomyProps, ITaxonomyState> {
  static defaultProps = {
    suggestions: [],
  };

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

    const tags = this.props.post.taxonomies
      .filter(tax => tax.type === this.props.for)
      .map(tax => {
        const { __typename, ...rest } = tax;
        return rest;
      });
    PostActions.setTaxonomies({ [this.props.for]: tags });
    this.setState({ tags: formatTagsForDropdown(tags) });
  }

  handleOnChange = (tags: Taxonomy[], { action }) => {
    if (action === "remove-value") {
      PostActions.setTaxonomies({
        [this.props.for]: formatTagsForBackend(tags),
      });
      this.setState({ tags });
    } else if (action === "select-option") {
      PostActions.setTaxonomies({
        [this.props.for]: formatTagsForBackend(tags),
      });
      this.setState({ tags });
    }
  };

  createNewTag = (tag: string) => {
    if (tag.trim().length === 0) return;
    const newTag = {
      id: 0,
      name: tag,
      type: this.props.for,
      slug: tag,
    };
    PostActions.setTaxonomies({
      [this.props.for]: formatTagsForBackend([...this.state.tags, newTag]),
    });
    this.setState({
      tags: formatTagsForDropdown([...this.state.tags, newTag]),
    });
  };

  render() {
    const name = this.props.for === "post_tag" ? "Tags" : "Categories";

    return (
      <StyledTags
        name={name}
        value={this.state.tags}
        onChange={this.handleOnChange}
        options={formatTagsForDropdown(
          (this.state.suggestions as Taxonomy[]).filter(
            p => p.type === this.props.for,
          ),
        )}
        isMulti
        isValidNewOption={inputValue => {
          return inputValue.trim().length > 0;
        }}
        closeMenuOnSelect={false}
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
    const { label, value, desc, __typename, ...rest } = tag;
    return rest;
  });
};
