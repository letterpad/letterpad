import React, { Component } from "react";
import { graphql } from "react-apollo";
import ArticleCreate from "../components/posts/ArticleCreate";
import PostPublish from "../components/posts/PostPublish";
import PostActions from "../components/posts/PostActions";
import Tags from "../components/posts/Tags";
import Categories from "../components/posts/Categories";
import { CREATE_POST } from "../../shared/queries/Mutations";
import Excerpt from "../components/posts/Excerpt";

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

        PostActions.subscribe(id => {
            this.props.history.push(`/admin/${type}/${id}`);
        });
        document.body.classList.add(`create-${type}`);
    }
    render() {
        if (this.state.loading) {
            return <div>hello</div>;
        }
        return (
            <section className="module-xs">
                <div className="row">
                    <div className="col-lg-8 column">
                        <ArticleCreate post={this.state.post} />
                    </div>
                    <div className="col-lg-4 column">
                        <PostPublish create post={this.state.post} />
                        <Tags post={this.state.post} />
                        <Categories post={this.state.post} />
                        <Excerpt post={this.state.post} />
                    </div>
                </div>
            </section>
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
