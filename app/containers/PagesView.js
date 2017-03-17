import React, { Component } from "react";
import { Link } from "react-router";
import Loader from "../components/Loader";
import moment from "moment";
import Sidebar from "../components/Sidebar";
import { gql, graphql } from "react-apollo";
import client from '../apolloClient';

class Row extends Component {
    render() {
        return (
            <tr>
                <td><input type="checkbox" value={this.props.post.id} /></td>
                <td>
                    <Link to={"/admin/page/" + this.props.post.id}>
                        {this.props.post.title}
                    </Link>
                </td>
                <td>{this.props.post.status}</td>
                <td>{this.props.post.author.username}</td>
                <td className="text-center">{moment(new Date(this.props.post.created_at)).format("YYYY-MM-DD HH:mm:ss")}</td>
            </tr>
        );
    }
}

class PagesView extends Component {
    constructor(args) {
        super(args);
    }
    componentDidMount() {
        if(this.props.pages) {
            client.query({query:allPosts,fetchPolicy:'network-only'});
        }
    }

    render() {
        if (this.props.loading) {
            return <Loader />;
        }
        let rows = this.props.pages.map((page, i) => {
            return <Row key={i} post={page} />;
        });

        return (
            <div className="col-md-12 col-sm-12 col-xs-12">
                <div className="x_panel">
                    <div className="x_title">
                        <h2>Sample - Redsnow</h2>
                        <div className="clearfix" />
                    </div>
                    <div className="x_content">
                        <table
                            className="table table-striped jambo_table bulk_action"
                        >
                            <thead>
                                <tr>
                                    <th />
                                    <th>Title</th>
                                    <th>Status</th>
                                    <th>Author</th>
                                    <th>Created On</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

const allPosts = gql`
  query getPosts {
  posts(type:"page") {
    id,
    title,
    body,
    author {
        username
    },
    status,
    created_at,
    excerpt,
    taxonomies {
      id,
      name,
      type
    }
  }
}
`;

const ContainerWithData = graphql(allPosts, {
    props: ({ data: { loading, posts } }) => ({
        pages: posts,
        loading
    })
});

export default ContainerWithData(PagesView);
