import React, { Component } from "react";
import { WithContext as ReactTags } from "react-tag-input";
import { gql, graphql } from "react-apollo";
import PostActions from "./PostActions";
import ReactDOM from "react-dom";
import { Card, CardActions, CardHeader, CardText } from "material-ui/Card";

var ContentEditable = React.createClass({
    render: function() {
        return (
            <span
                className="post-excerpt"
                onInput={this.emitChange}
                onBlur={this.emitChange}
                contentEditable
                dangerouslySetInnerHTML={{
                    __html: this.props.excerpt
                }}
            />
        );
    },
    componentDidMount: function() {
        this.lastExcerpt = this.props.excerpt;
    },

    shouldComponentUpdate: function(nextProps) {
        return nextProps.excerpt !== ReactDOM.findDOMNode(this).innerHTML;
    },
    emitChange: function() {
        var excerpt = ReactDOM.findDOMNode(this).innerHTML;
        if (this.props.onChange && excerpt !== this.lastExcerpt) {
            this.props.onChange({
                target: {
                    value: excerpt
                }
            });
        }
        this.lastExcerpt = excerpt;
    }
});

class Excerpt extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        PostActions.setData({ excerpt: this.props.post.excerpt });
    }

    render() {
        return (
            <Card>
                <CardHeader title="Excerpt" />
                <CardText>
                    <ContentEditable
                        excerpt={this.props.post.excerpt}
                        onChange={e => {
                            PostActions.setData({
                                excerpt: e.target.value
                            });
                        }}
                    />
                </CardText>
            </Card>
        );
    }
}

export default Excerpt;
