import React, { Component } from "react";
import { graphql } from "react-apollo";
import PropTypes from "prop-types";

import StyledTags from "../../../components/tags";
import { TAX_SUGGESTIONS } from "../../../../shared/queries/Queries";
import PostActions from "../PostActions";

export class Taxonomies extends Component {
    static propTypes = {
        suggestions: PropTypes.array,
        post: PropTypes.object,
        for: PropTypes.string.isRequired
    };

    state = {
        tags: [],
        loading: true
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
        this.setState({ tags });
    }

    handleOnChange = tags => {
        const newTags = tags.map(tag => {
            // check if this is a new custom tag
            if (!tag.id) {
                return {
                    id: 0,
                    name: tag.name,
                    type: this.props.for,
                    slug: tag.name
                };
            }
            delete tag["__typename"];
            return tag;
        });
        PostActions.setTaxonomies({ [this.props.for]: newTags });
        this.setState({ tags: newTags });
    };

    render() {
        const name = this.props.for === "post_tag" ? "Tags" : "Categories";
        return (
            <StyledTags
                name={name}
                labelKey="name"
                valueKey="name"
                value={this.state.tags}
                onChange={this.handleOnChange}
                options={this.props.suggestions}
                multi={true}
            />
        );
    }
}

const TaxSuggestionsData = graphql(TAX_SUGGESTIONS, {
    props: ({ data: { loading, taxonomies } }) => ({
        suggestions: taxonomies,
        loading
    })
});

export default TaxSuggestionsData(Taxonomies);
