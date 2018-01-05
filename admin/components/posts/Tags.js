import React, { Component } from "react";
import { WithContext as ReactTags } from "react-tag-input";
import { gql, graphql } from "react-apollo";
import PostActions from "./PostActions";
import {
    Card,
    CardActions,
    CardHeader,
    CardMedia,
    CardTitle,
    CardText
} from "material-ui/Card";
import Chip from "material-ui/Chip";
import AutoComplete from "material-ui/AutoComplete";

class Tags extends Component {
    constructor(props) {
        super(props);
        this.renderChip = this.renderChip.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.state = {
            tags: [],
            suggestions: []
        };
        this.styles = {
            chip: {
                margin: 4
            },
            wrapper: {
                display: "flex",
                flexWrap: "wrap"
            }
        };
    }

    componentDidMount() {
        this.state.tags = this.props.post.taxonomies
            .filter(tax => {
                return tax.type === "post_tag";
            })
            .map(tax => {
                tax = { ...tax };
                delete tax["__typename"];
                return tax;
            });
        PostActions.setTaxonomies({ post_tag: this.state.tags });
        this.setState(this.state);
    }

    componentWillReceiveProps(nextProps) {
        if (
            nextProps.suggestions &&
            nextProps.suggestions.length !== this.state.suggestions.length
        ) {
            const doExist = name =>
                this.state.tags.some(tag => tag.name === name);

            nextProps.suggestions.forEach(t => {
                if (!doExist(t.name)) {
                    this.state.suggestions.push({ name: t.name, id: t.id });
                }
            });
        }
    }

    handleDelete(name) {
        this.state.tags.forEach((tag, i) => {
            if (tag.name == name) {
                this.state.suggestions.push({
                    id: this.state.tags[i].id,
                    name: this.state.tags[i].name
                });
                this.state.tags.splice(i, 1);
            }
        });
        this.setState(this.state);
    }

    handleAddition(tag, idx) {
        let found = this.state.tags.some(ele => ele.name === tag);
        if (!found) {
            let foundInSuggestion = this.state.suggestions.filter((ele, i) => {
                if (ele.name === tag) {
                    this.state.suggestions.splice(i, 1);
                    return ele.id;
                }
                return 0;
            });

            let id = foundInSuggestion.length > 0 ? foundInSuggestion[0].id : 0;

            this.state.tags.push({
                id: id,
                name: tag,
                type: "post_tag"
            });
            PostActions.setTaxonomies({ post_tag: this.state.tags });
            this.setState(this.state);
        }
    }

    handleDrag(tag, currPos, newPos) {
        // mutate array
        this.tags.splice(currPos, 1);
        this.tags.splice(newPos, 0, tag);

        PostActions.setTaxonomies({ post_tag: this.tags });
    }
    renderChip(data) {
        const newData = { ...data };
        const min = 1;
        const max = 999999;
        const random_id = Math.floor(Math.random() * (max - min + 1)) + min;
        newData.id = newData.id + "-" + random_id;
        return (
            <Chip
                key={newData.id}
                onRequestDelete={() => this.handleDelete(newData.name)}
                style={this.styles.chip}
            >
                {newData.name}
            </Chip>
        );
    }

    render() {
        const suggestions = this.state.suggestions.map(item => item.name);
        return (
            <Card>
                <CardHeader title="Tags" />
                <CardText>
                    <div style={this.styles.wrapper}>
                        {this.state.tags.map(this.renderChip, this)}
                    </div>
                    <AutoComplete
                        hintText="Enter a tag and press enter"
                        dataSource={suggestions}
                        openOnFocus={true}
                        onNewRequest={this.handleAddition}
                        fullWidth={true}
                        filter={(searchText, key) =>
                            key.toLowerCase().includes(searchText.toLowerCase())
                        }
                    />
                </CardText>
            </Card>
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
    options: { variables: { type: "post_tag" } },
    props: ({ data: { loading, taxonomies } }) => ({
        suggestions: taxonomies,
        loading
    })
});

export default TaxSuggestionsData(Tags);
