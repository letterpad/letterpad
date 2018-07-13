import React, { Component } from "react";
import { gql, graphql } from "react-apollo";
import PropTypes from "prop-types";
import Select from "react-select";

import PostActions from "./PostActions";

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
                return tax;
            });
        PostActions.setTaxonomies({ post_category: categories });
        this.setState({ categories });
    }

    handleOnChange = categories => {
        const newCategories = categories.map(category => {
            // check if this is a new custom tag
            if (!category.id) {
                return {
                    id: 0,
                    name: category.name,
                    type: "post_category",
                    slug: category.name
                };
            }
            delete category["__typename"];
            return category;
        });
        PostActions.setTaxonomies({ post_category: newCategories });
        this.setState({ categories: newCategories });
    };

    render() {
        return (
            <div>
                <div className="meta-label">Categories</div>
                <div className="x_content">
                    <div className="control-group">
                        <Select.Creatable
                            labelKey="name"
                            valueKey="name"
                            value={this.state.categories}
                            onChange={this.handleOnChange}
                            options={this.props.suggestions}
                            multi={true}
                        />
                    </div>
                </div>
                <hr />
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
