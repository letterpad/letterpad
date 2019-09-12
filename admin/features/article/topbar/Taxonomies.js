import React, { Component } from "react";
import { graphql } from "@apollo/react-hoc";
import PropTypes from "prop-types";

import StyledTags from "../../../components/tags";
import { TAX_SUGGESTIONS } from "../../../../shared/queries/Queries";
import PostActions from "../PostActions";

const formatTagsForDropdown = tags => {
  return tags.map(tag => {
    return {
      ...tag,
      label: tag.name,
      value: tag.name,
    };
  });
};

const formatTagsForBackend = tags => {
  return tags.map(tag => {
    // eslint-disable-next-line no-unused-vars
    const { label, value, __typename, ...rest } = tag;
    return rest;
  });
};

export class Taxonomies extends Component {
  static propTypes = {
    suggestions: PropTypes.array,
    post: PropTypes.object,
    for: PropTypes.string.isRequired,
  };

  static defaultProps = {
    suggestions: [],
  };

  state = {
    tags: [],
    loading: true,
  };

  componentDidMount() {
    const tags = this.props.post.taxonomies
      .filter(tax => {
        return tax.type === this.props.for;
      })
      .map(tax => {
        delete tax["__typename"];
        return tax;
      });
    PostActions.setTaxonomies({ [this.props.for]: tags });
    this.setState({ tags: formatTagsForDropdown(tags) });
  }

  handleOnChange = (tags, { action }) => {
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

  createNewTag = tag => {
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
          this.props.suggestions.filter(p => p.type === this.props.for),
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

const TaxSuggestionsData = graphql(TAX_SUGGESTIONS, {
  props: ({ data: { loading, taxonomies } }) => ({
    suggestions: taxonomies,
    loading,
  }),
});

export default TaxSuggestionsData(Taxonomies);
