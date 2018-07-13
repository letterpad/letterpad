import React, { Component } from "react";
import { graphql } from "react-apollo";
import PropTypes from "prop-types";
import Select from "react-select";

import { TAX_SUGGESTIONS } from "../../../shared/queries/Queries";
import PostActions from "./PostActions";

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
                delete tax["__typename"];
                return tax;
            });

        PostActions.setTaxonomies({ post_tag: tags });
        this.setState({ tags });
    }
    handleOnChange = tags => {
        const newTags = tags.map(tag => {
            // check if this is a new custom tag
            if (!tag.id) {
                return {
                    id: 0,
                    name: tag.name,
                    type: "post_tag",
                    slug: tag.name
                };
            }
            delete tag["__typename"];
            return tag;
        });
        PostActions.setTaxonomies({ post_tag: newTags });
        this.setState({ tags: newTags });
    };
    render() {
        return (
            <div>
                <div className="meta-label">Tags</div>
                <div className="x_content">
                    <div className="control-group">
                        <Select.Creatable
                            labelKey="name"
                            valueKey="name"
                            value={this.state.tags}
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

const TaxSuggestionsData = graphql(TAX_SUGGESTIONS, {
    options: { variables: { type: "post_tag" } },
    props: ({ data: { loading, taxonomies } }) => ({
        suggestions: taxonomies,
        loading
    })
});

export default TaxSuggestionsData(Tags);
