import React, { Component } from "react";
import { WithContext as ReactTags } from "react-tag-input";
import { gql, graphql } from "react-apollo";
import PostActions from "./PostActions";
import PropTypes from "prop-types";

export class Categories extends Component {
    static propTypes = {
        suggestions: PropTypes.array,
        post: PropTypes.object
    };
    state = {
        categories: []
    };

    componentDidMount() {
        const categories = this.props.post.taxonomies
            .filter(tax => {
                return tax.type === "post_category";
            })
            .map(tax => {
                delete tax["__typename"];
                // react tags does uses text as a param internally
                // so we need to add this key.
                tax.text = tax.name;
                return tax;
            });
        PostActions.setTaxonomies({ post_category: categories });
        this.setState({ categories });
    }

    handleDelete = i => {
        const categories = [...this.state.categories];
        categories.splice(i, 1);
        PostActions.setTaxonomies({ post_category: categories });
        this.setState({ categories });
    };

    handleAddition = tag => {
        let found = this.state.categories.some(ele => ele.name === tag);
        let foundInSuggestion = this.props.suggestions.filter(
            ele => (ele.name === tag ? ele.id : 0)
        );

        let id = foundInSuggestion.length > 0 ? foundInSuggestion[0].id : 0;
        if (!found) {
            const categories = [
                ...this.state.categories,
                {
                    id: id,
                    name: tag,
                    text: tag,
                    type: "post_category"
                }
            ];
            PostActions.setTaxonomies({ post_category: categories });
            this.setState({ categories });
        }
    };

    handleDrag = (tag, currPos, newPos) => {
        const categories = [...this.state.categories];
        categories.splice(currPos, 1);
        categories.splice(newPos, 0, tag);
        PostActions.setTaxonomies({ post_category: categories });
        this.setState({ categories });
    };

    render() {
        let suggestions = this.props.suggestions || [];
        suggestions = suggestions.map(t => t.name);

        return (
            <div className="card">
                <div className="x_title">
                    <div className="module-title">Categories</div>
                    <div className="clearfix" />
                </div>
                <div className="x_content">
                    <div className="control-group">
                        <ReactTags
                            suggestions={suggestions}
                            autofocus={false}
                            placeholder="Add new category..."
                            tags={this.state.categories}
                            labelField="name"
                            handleDelete={this.handleDelete}
                            handleAddition={this.handleAddition}
                            handleDrag={this.handleDrag}
                        />
                    </div>
                </div>
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
