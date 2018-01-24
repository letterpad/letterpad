import React, { Component } from "react";
import { graphql } from "react-apollo";
import ArticleCreate from "../components/posts/ArticleCreate";
import PostPublish from "../components/posts/PostPublish";
import PostActions from "../components/posts/PostActions";
import Tags from "../components/posts/Tags";
import Categories from "../components/posts/Categories";
import { CREATE_POST } from "../../shared/queries/Mutations";
import Excerpt from "../components/posts/Excerpt";
import { plural } from "../../shared/util";
import Loader from "../components/Loader";

class Create extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            post: {}
        };
    }
    componentDidMount() {
        const { type } = this.props;
        this.props.createPost({ type }).then(result => {
            PostActions.setData(result.data.createPost.post);
            this.setState({
                loading: false,
                post: result.data.createPost.post
            });
        });

        PostActions.subscribe(post => {
            if ((post.status = "trash")) {
                this.props.history.push(`/admin/${plural[post.type]}`);
            } else {
                this.props.history.push(
                    `/admin/${plural[post.type]}/${post.id}`
                );
            }
        });
        document.body.classList.add(`create-${type}`);
    }
    render() {
        if (this.state.loading) {
            return <Loader />;
        }

        return (
            <div>
                <div className="col-lg-8 column">
                    <ArticleCreate post={this.state.post} />
                </div>
                <div className="col-lg-4 column">
                    <PostPublish create post={this.state.post} />
                    <br />
                    <Tags post={this.state.post} />
                    <br />
                    <Categories post={this.state.post} />
                    <br />
                    <Excerpt post={this.state.post} />
                </div>
            </div>
        );
    }
}

const createQueryWithData = graphql(CREATE_POST, {
    props: ({ mutate }) => ({
        createPost: data =>
            mutate({
                variables: data
            })
    })
});

export default createQueryWithData(Create);
