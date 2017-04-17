import React, { Component } from "react";
import { WithContext as ReactTags } from "react-tag-input";
import { gql, graphql } from "react-apollo";
import PostActions from "./PostActions";

class Tags extends Component {
    constructor(props) {
        super(props);
        this.tags = [];
    }

    componentDidMount() {
        this.tags = this.props.post.taxonomies
            .filter(tax => {
                return tax.type === "post_tag";
            })
            .map(tax => {
                delete tax["__typename"];
                return tax;
            });
        PostActions.setTaxonomies({ post_tag: this.tags });
    }

    handleDelete(i) {
        this.tags.splice(i, 1);
    }

    handleAddition(tag) {
        let found = this.tags.some(ele => ele.name === tag);
        let foundInSuggestion = this.props.suggestions.filter(
            ele => ele.name === tag ? ele.id : 0
        );

        let id = foundInSuggestion.length > 0 ? foundInSuggestion[0].id : 0;
        if (!found) {
            this.tags.push({
                id: id,
                name: tag,
                type: "post_tag"
            });
            PostActions.setTaxonomies({ post_tag: this.tags });
        }
    }

    handleDrag(tag, currPos, newPos) {
        // mutate array
        this.tags.splice(currPos, 1);
        this.tags.splice(newPos, 0, tag);

        PostActions.setTaxonomies({ post_tag: this.tags });
    }

    render() {
        let suggestions = this.props.suggestions || [];
        suggestions = suggestions.map(t => t.name);

        return (
            <div className="x_panel m-b-20">
                <div className="x_title">
                    <h2>Tags</h2>
                    <div className="clearfix" />
                </div>
                <div className="x_content">
                    <div className="control-group">
                        <ReactTags
                            suggestions={suggestions}
                            autofocus={false}
                            placeholder="Add new tag..."
                            tags={this.tags}
                            labelField="name"
                            handleDelete={this.handleDelete.bind(this)}
                            handleAddition={this.handleAddition.bind(this)}
                            handleDrag={this.handleDrag.bind(this)}
                        />
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
    options: { variables: { type: "post_tag" } },
    props: ({ data: { loading, taxonomies } }) => ({
        suggestions: taxonomies,
        loading
    })
});

export default TaxSuggestionsData(Tags);
