import React, { Component } from "react";
import { WithContext as ReactTags } from "react-tag-input";
import { graphql } from "react-apollo";
import PostActions from "./PostActions";
import { TAX_SUGGESTIONS } from "../../../shared/queries/Queries";
import PropTypes from "prop-types";

export class Tags extends Component {
    static propTypes = {
        suggestions: PropTypes.array,
        post: PropTypes.object
    };

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
                tax = { ...tax };
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
            ele => (ele.name === tag ? ele.id : 0)
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
            <div className="card">
                <div className="x_title">
                    <div className="module-title">Tags</div>
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

const TaxSuggestionsData = graphql(TAX_SUGGESTIONS, {
    options: { variables: { type: "post_tag" } },
    props: ({ data: { loading, taxonomies } }) => ({
        suggestions: taxonomies,
        loading
    })
});

export default TaxSuggestionsData(Tags);
