import React, { Component } from "react";
import { WithContext as ReactTags } from "react-tag-input";
import { gql, graphql } from "react-apollo";

class Categories extends Component {
    constructor(props) {
        super(props);
        this.categories = [];
    }
    
    componentDidMount() {
        this.categories = this.props.post.taxonomies.filter(tax => {
            return tax.type === "post_category";
        }).map(tax => {delete tax['__typename']; return tax;});
        this.props.setData({ post_category: this.categories });
    }
    
    handleDelete(i) {
        this.categories.splice(i, 1);
    }

    handleAddition(tag) {
        let found = this.categories.some(ele => ele.name === tag);
        let foundInSuggestion = this.props.suggestions.filter(
            ele => ele.name === tag ? ele.id : 0
        );

        let id = foundInSuggestion.length > 0 ? foundInSuggestion[0].id : 0;
        if (!found) {
            this.categories.push({
                id: id,
                name: tag,
                type: "post_category"
            });
            this.props.setData({ post_category: this.categories });
        }
    }

    handleDrag(tag, currPos, newPos) {
        
        // mutate array
        this.categories.splice(currPos, 1);
        this.categories.splice(newPos, 0, tag);

        this.props.setData({ post_category: this.categories });
    }

    render() {
        let suggestions = this.props.suggestions || [];
        suggestions = suggestions.map(t => t.name);

        return (
            <div className="x_panel">
                <div className="x_title">
                    <h2>Categories</h2>
                    <div className="clearfix" />
                </div>
                <div className="x_content">
                    <div className="control-group">
                        <div className="col-xs-12 row">
                            <ReactTags
                                suggestions={suggestions}
                                tags={this.categories}
                                labelField="name"
                                handleDelete={this.handleDelete.bind(this)}
                                handleAddition={this.handleAddition.bind(this)}
                                handleDrag={this.handleDrag.bind(this)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


const TaxSuggestionsQuery = gql`
  query getTaxonomies($type: String!) {
  taxonomies(type:$type) {
    id,
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
