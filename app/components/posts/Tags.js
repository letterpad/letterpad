import React, { Component } from "react";
import { WithContext as ReactTags } from "react-tag-input";

export default class Tags extends Component {
    constructor(props) {
        super(props);
        this.state = {
            post_tag: [],
            suggestions: []
        };
    }
    componentDidMount() {
        //this.setState({ post_tag: this.props.post.data.taxonomies.post_tag });
    }
    componentWillReceiveProps(newState) {
        this.setState({
            post_tag: (newState.post.data.taxonomies && newState.post.data.taxonomies.post_tag) || [],
            suggestions: newState.post.taxonomyList.post_tag || []
        },()=>{
            this.props.setData({post_tag: this.state.post_tag});
        });
    }
    handleDelete(i) {
        let post_tag = this.state.post_tag;
        post_tag.splice(i, 1);
        this.setState({ post_tag: post_tag });
    }

    handleAddition(tag) {
        let post_tags = this.state.post_tag;
        let found = post_tags.some(ele => ele.name === tag);
        let foundInSuggestion = this.state.suggestions.filter(ele => ele.name === tag ? ele.id : 0);

        let id = foundInSuggestion.length > 0 ? foundInSuggestion[0].id : 0;
        if (!found) {
            post_tags.push({
                id: id,
                name: tag,
                type: "post_tag"
            });
            this.setState({ post_tag: post_tags });
            this.props.setData({ post_tag: post_tags });
        }
    }

    handleDrag(tag, currPos, newPos) {
        let post_tags = this.state.post_tag;

        // mutate array
        post_tags.splice(currPos, 1);
        post_tags.splice(newPos, 0, tag);

        // re-render
        this.setState({ post_tag: post_tags });
        this.props.setData({ post_tag: post_tags });
    }

    render() {
        let post_tags = this.state.post_tag;
        let suggestions = this.state.suggestions.map(t => t.name);

        return (
            <div className="x_panel">
                <div className="x_title">
                    <h2>Tags</h2>
                    <div className="clearfix" />
                </div>
                <div className="x_content">
                    <div className="control-group">
                        <div className="col-xs-12 row">
                            <ReactTags
                                suggestions={suggestions}
                                tags={post_tags}
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