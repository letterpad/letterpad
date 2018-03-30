import React, { Component } from "react";
import { graphql } from "react-apollo";
import moment from "moment";
import PropTypes from "prop-types";
import { plural } from "../../../shared/util";
import {
    ArticleCreate,
    PostPublish,
    PostActions,
    Tags,
    Categories,
    Excerpt,
    FeaturedImage
} from "../../components/Post";
import CreatePost from "../../data-connectors/CreatePost";

class Create extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            post: {}
        };
    }
    componentWillMount() {
        const { type } = this.props;
        document.body.classList.add("create-" + this.props.type + "-page");
        const title = "Draft - " + moment().format("L LT");
        this.props.createPost({ type, title }).then(result => {
            PostActions.setData(result.data.createPost.post);
            this.setState({
                loading: false,
                post: result.data.createPost.post
            });
        });

        PostActions.subscribe("update", post => {
            if (post.status == "trash") {
                this.props.history.push(`/admin/${plural[post.type]}`);
            } else {
                this.props.history.push(
                    `/admin/${plural[post.type]}/${post.id}`
                );
            }
        });
    }
    componentWillUnmount() {
        document.body.classList.remove("create-" + this.props.type + "-page");
    }

    render() {
        if (this.state.loading) {
            return <div>hello</div>;
        }
        return (
            <section className="module-xs create-post">
                <div className="row">
                    <div className="col-lg-8 column article-holder col-lg-offset-2">
                        <ArticleCreate post={this.state.post} />
                    </div>
                    <div className="col-lg-4 column distractor">
                        <PostPublish create post={this.state.post} />
                        <Tags post={this.state.post} />
                        <Categories post={this.state.post} />
                        <Excerpt post={this.state.post} />
                        <FeaturedImage post={this.props.post} />
                    </div>
                </div>
            </section>
        );
    }
}

Create.propTypes = {
    history: PropTypes.object,
    createPost: PropTypes.func,
    type: PropTypes.string
};

export default CreatePost(Create);
