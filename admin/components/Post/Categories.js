import React, { Component } from "react";
import { gql, graphql } from "react-apollo";
import PropTypes from "prop-types";
import { WithContext as ReactTags } from "react-tag-input";

import PostActions from "./PostActions";

export class Categories extends Component {
    static propTypes = {
        suggestions: PropTypes.array,
        post: PropTypes.object
    };

    categories = [];

    componentDidMount() {
        this.categories = this.props.post.taxonomies
            .filter(tax => {
                return tax.type === "post_category";
            })
            .map(tax => {
                delete tax["__typename"];
                return tax;
            });
        PostActions.setTaxonomies({ post_category: this.categories });
    }

    handleDelete = i => {
        this.categories.splice(i, 1);
    };

    handleAddition = tag => {
        let found = this.categories.some(ele => ele.name === tag);
        let foundInSuggestion = this.props.suggestions.filter(
            ele => (ele.name === tag ? ele.id : 0)
        );

        let id = foundInSuggestion.length > 0 ? foundInSuggestion[0].id : 0;
        if (!found) {
            this.categories.push({
                id: id,
                name: tag,
                type: "post_category"
            });
            PostActions.setTaxonomies({ post_category: this.categories });
        }
    };

    handleDrag = (tag, currPos, newPos) => {
        // mutate array
        this.categories.splice(currPos, 1);
        this.categories.splice(newPos, 0, tag);

        PostActions.setTaxonomies({ post_category: this.categories });
    };

    render() {
        let suggestions = this.props.suggestions || [];
        suggestions = suggestions.map(t => t.name);
        return (
            <div>
                <div style={{ marginBottom: "10px" }}>Categories</div>
                <ReactTags
                    suggestions={suggestions}
                    autofocus={false}
                    placeholder="Add new category..."
                    tags={this.categories}
                    labelField="name"
                    handleDelete={this.handleDelete.bind(this)}
                    handleAddition={this.handleAddition.bind(this)}
                    handleDrag={this.handleDrag.bind(this)}
                />
            </div>
        );
    }
}

const TaxSuggestionsQuery = gql`
    query getTaxonomies($type: String!) {
        taxonomies(type: $type) {
            id
            name
        }
    }
`;
const TaxSuggestionsData = graphql(TaxSuggestionsQuery, {
    options: { variables: { type: "post_category" } },
    props: ({ data: { loading, taxonomies } }) => ({
        suggestions: taxonomies,
        loading
    })
});

export default TaxSuggestionsData(Categories);
