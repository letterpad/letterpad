import React, { Component } from "react";
import PostActions from "./PostActions";
import { gql, graphql } from "react-apollo";
import moment from "moment";
import siteConfig from "../../../config/site.config";

const actions = {
    publish: "Published",
    draft: "Save Draft"
};
class PostPublish extends Component {
    constructor(props) {
        super(props);
        this.changePostStatus = this.changePostStatus.bind(this);
        this.state = {
            published: 1
        };
    }
    componentWillReceiveProps(nextProps) {
        const status = nextProps.post.status == "publish" ? 1 : 0;
        if (status != this.state.published) {
            this.setState({ published: nextProps.post.status });
        }
    }

    componentDidMount() {
        PostActions.setData(this.props.post);
    }

    changePostStatus(e) {
        this.setState({
            published: ~~e.target.checked
        });
    }

    updatePost(e, status) {
        e.preventDefault();
        PostActions.setData(status);
        let data = PostActions.getData();
        return this.props
            .update({
                ...this.props.post,
                ...data
            })
            .then(result => {
                PostActions.postUpdated(result.data.updatePost.id);
                this.props.refetchQueries();
            });
    }

    getButton(label, btnType = "btn-dark", status) {
        if (typeof status == "undefined") {
            status = this.state.published ? "publish" : "draft";
        }
        if (status)
            return (
                <div className="btn-item">
                    <button
                        type="submit"
                        onClick={e => this.updatePost(e, { status: status })}
                        className={"btn btn-sm " + btnType}
                    >
                        {label}
                    </button>
                </div>
            );
    }

    render() {
        const publishedCls = this.state.published ? "on" : "off";
        const permalink = siteConfig.root_url + "post/" + this.props.post.slug;
        return (
            <div className="card">
                <div className="module-title">Publishing</div>
                <div className={"switch-block m-b-20 " + publishedCls}>
                    <span className="switch-label switch-off-text">Draft</span>
                    <label className="switch">
                        <input
                            type="checkbox"
                            onChange={this.changePostStatus}
                            checked={this.state.published}
                        />
                        <span className="slider round" />
                    </label>
                    <span className="switch-label switch-on-text">Publish</span>
                </div>
                <div className="x_content m-b-20">
                    <label className="custom-label">
                        <i className="fa fa fa-calendar" /> Published at
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Published date"
                        value={moment(
                            new Date(this.props.post.created_at)
                        ).format("DD-MM-Y hh:mm A")}
                    />
                </div>
                <div className="x_content m-b-20">
                    <label className="custom-label">
                        <i className="fa fa fa-link" /> Slug
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Slug"
                        value={this.props.post.slug}
                    />
                </div>
                <div className="x_content m-b-20">
                    <label className="custom-label">
                        <i className="fa fa fa-link" /> Permalink
                    </label>
                    <div>
                        <a target="_blank" href={permalink}>
                            {permalink}
                        </a>
                    </div>
                </div>
                <div className="x_content">
                    <div className="btn-together">
                        {this.getButton("Publish", "btn-info")}
                        {this.getButton("Trash", "btn-danger", "deleted")}
                    </div>
                </div>
            </div>
        );
    }
}

const updatePostQuery = gql`
    mutation updatePost(
        $id: Int!
        $title: String!
        $body: String!
        $status: String!
        $excerpt: String!
        $taxonomies: [TaxonomyInputType]
    ) {
        updatePost(
            id: $id
            title: $title
            body: $body
            status: $status
            excerpt: $excerpt
            taxonomies: $taxonomies
        ) {
            id
            title
            body
            author {
                username
            }
            type
            status
            excerpt
            created_at
            cover_image
            taxonomies {
                id
                name
                type
            }
        }
    }
`;
const updateQueryWithData = graphql(updatePostQuery, {
    props: ({ mutate }) => ({
        update: data =>
            mutate({
                variables: data,
                updateQueries: {
                    getPost: (prev, { mutationResult }) => {
                        return {
                            post: {
                                ...prev.post,
                                ...mutationResult.data.updatePost
                            }
                        };
                    }
                }
            })
    })
});
export default updateQueryWithData(PostPublish);
