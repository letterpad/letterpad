import React, { Component } from "react";
import { WithContext as ReactTags } from "react-tag-input";

export default class Categories extends Component {
    constructor(props) {
        super(props);
        this.state = {
            post_category: [],
            suggestions: []
        };
    }
    componentDidMount() {
        //this.setState({ post_category: this.props.post.data.taxonomies.post_category || []});
    }
    componentWillReceiveProps(newState) {
        this.setState({
            post_category: newState.post.data.taxonomies.post_category || [],
            suggestions: newState.post.taxonomy.post_category || []
        });

        this.props.setData(this.state);
    }
    handleDelete(i) {
        let post_category = this.state.post_category;
        post_category.splice(i, 1);
        this.setState({ post_category: post_category });
    }

    handleAddition(tag) {
        let post_categories = this.state.post_category ;
        let found = post_categories.some(ele => ele.name === tag);
        let foundInSuggestion = this.state.suggestions.filter(ele => ele.name === tag ? ele.id : 0);

        let id = foundInSuggestion.length > 0 ? foundInSuggestion[0].id : 0;
        if (!found) {
            post_categories.push({
                id: id,
                name: tag,
                type: "post_category"
            });
            this.setState({ post_category: post_categories });
            this.props.setData({ post_category: post_categories });
        }
    }

    handleDrag(tag, currPos, newPos) {
        let post_categories = this.state.post_category;

        // mutate array
        post_categories.splice(currPos, 1);
        post_categories.splice(newPos, 0, tag);

        // re-render
        this.setState({ post_category: post_categories });
    }

    render() {
        let post_categories = this.state.post_category || [];
        let s = this.state.suggestions || [];
        let suggestions = s.map(t => t.name);

        return (
            <div className="x_panel">
                <div className="x_title">
                    <h2>Categories</h2>
                    <div className="clearfix" />
                </div>
                <div className="x_content">
                    <div className="control-group">
                        <div className="col-xs-12">
                            <ReactTags
                                suggestions={suggestions}
                                tags={post_categories}
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