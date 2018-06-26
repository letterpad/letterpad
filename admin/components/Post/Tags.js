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

    state = {
        tags: []
    };

    componentDidMount() {
        const tags = this.props.post.taxonomies
            .filter(tax => {
                return tax.type === "post_tag";
            })
            .map(tax => {
                tax = { ...tax };
                // react tags does uses text as a param internally
                // so we need to add this key.
                tax.text = tax.name;
                delete tax["__typename"];
                return tax;
            });
        PostActions.setTaxonomies({ post_tag: tags });
        this.setState({ tags });
    }

    handleDelete = i => {
        const tags = [...this.state.tags];
        tags.splice(i, 1);
        PostActions.setTaxonomies({ post_tag: tags });
        this.setState({ tags });
    };

    handleAddition = tag => {
        let found = this.state.tags.some(ele => ele.name === tag);
        let foundInSuggestion = this.props.suggestions.filter(
            ele => (ele.name === tag ? ele.id : 0)
        );

        let id = foundInSuggestion.length > 0 ? foundInSuggestion[0].id : 0;
        if (!found) {
            const tags = [
                ...this.state.tags,
                {
                    id: id,
                    name: tag,
                    text: tag,
                    type: "post_tag"
                }
            ];
            PostActions.setTaxonomies({ post_tag: tags });
            this.setState({ tags });
        }
    };

    handleDrag = (tag, currPos, newPos) => {
        const tags = [...this.state.tags];
        tags.splice(currPos, 1);
        tags.splice(newPos, 0, tag);
        PostActions.setTaxonomies({ post_tag: tags });
        this.setState({ tags });
    };

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
                            tags={this.state.tags}
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

const TaxSuggestionsData = graphql(TAX_SUGGESTIONS, {
    options: { variables: { type: "post_tag" } },
    props: ({ data: { loading, taxonomies } }) => ({
        suggestions: taxonomies,
        loading
    })
});

export default TaxSuggestionsData(Tags);
