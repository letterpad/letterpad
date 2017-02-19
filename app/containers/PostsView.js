import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as ActionCreators from "../redux/actions/ActionCreators";
import { Link } from "react-router";
import Loader from "../components/Loader";

import Sidebar from "../components/Sidebar";

class Row extends Component {
    render() {
        return (
            <tr>
                <td><input type="checkbox" value={this.props.post.id} /></td>
                <td><Link to={"/admin/post/" + this.props.post.id}>{this.props.post.title}</Link></td>
                <td>{this.props.post.status}</td>
                <td>{this.props.post.author}</td>
                <td className="text-center">{this.props.post.created_on}</td>
            </tr>
        );
    }
}

class PostsView extends Component {
    componentDidMount() {
        this.props.getPosts(1);
    }

    render() {
        if (this.props.posts.loading) {
            return <Loader />;
        }
        let rows = this.props.posts.data.map((post, i) => {
            return <Row key={i} post={post} />;
        });

        return (
            <div className="col-md-12 col-sm-12 col-xs-12">
                <div className="x_panel">
                    <div className="x_title">
                        <h2>Sample - Redsnow</h2>
                        <div className="clearfix"/>
                    </div>
                    <div className="x_content">
                        <table className="table table-striped jambo_table bulk_action">
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

const mapStateToProps = state => {
    return {
        posts: state.posts.posts
    };
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            getPosts: ActionCreators.getPosts
        },
        dispatch
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(PostsView);