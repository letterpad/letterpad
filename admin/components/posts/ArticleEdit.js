import React, { Component } from "react";
import moment from "moment";
import Editor from "./Editor";
import PostActions from "./PostActions";
import FeaturedImage from "./FeaturedImage";
import ContentEditable from "./ContentEditable";
import PropTypes from "prop-types";
import Card, { CardHeader, CardContent, CardMedia } from "material-ui/Card";

export default class ArticleEdit extends Component {
    render() {
        return (
            <Card>
                <CardMedia>
                    <FeaturedImage post={this.props.post} />
                </CardMedia>
                <CardHeader
                    textStyle={{ width: "100%" }}
                    title={
                        <ContentEditable
                            title={this.props.post.title}
                            placeholder="Enter a title"
                            onChange={e => {
                                PostActions.setData({
                                    title: e.target.value
                                });
                            }}
                        />
                    }
                    subheader={
                        <div className="post-meta">
                            {moment(
                                new Date(this.props.post.created_at)
                            ).format("LL")}
                        </div>
                    }
                />
                <CardContent>
                    <Editor body={this.props.post.body} />
                </CardContent>
            </Card>
        );
    }
}

ArticleEdit.propTypes = {
    post: PropTypes.object
};
