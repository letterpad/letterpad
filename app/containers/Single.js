import React, { Component } from "react";
import ArticleEdit from "../components/posts/ArticleEdit";
import { graphql } from "react-apollo";
import PostPublish from "../components/posts/PostPublish";
import Tags from "../components/posts/Tags";
import Categories from "../components/posts/Categories";
import Excerpt from "../components/posts/Excerpt";
import { GET_SINGLE_POST } from "../../shared/queries/Queries";

export default function Single(type) {
    class Single extends Component {
        constructor(props) {
            super(props);
        }

        render() {
            if (this.props.loading) {
                return <div>hello</div>;
            }
            return (
                <section className="module-xs">
                    <div className="row">
                        <div className="col-lg-8 column">
                            <ArticleEdit post={this.props.post} />
                        </div>
                        <div className="col-lg-4 column">
                            <PostPublish post={this.props.post} />
                            <Tags post={this.props.post} />
                            <Categories post={this.props.post} />
                            <Excerpt post={this.props.post} />
                        </div>
                    </div>
                </section>
            );
        }
    }

    const ContainerWithData = graphql(GET_SINGLE_POST, {
        options: props => ({ variables: { id: props.params.post_id } }),
        props: ({ data: { loading, post } }) => ({
            post,
            loading
        })
    });

    return ContainerWithData(Single);
}
