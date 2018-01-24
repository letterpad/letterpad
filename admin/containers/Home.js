import React, { Component } from "react";
import { gql, graphql } from "react-apollo";
import Card, { CardActions, CardContent, CardHeader } from "material-ui/Card";
import Button from "material-ui/Button";
import { Link } from "react-router-dom";
import { FormGroup } from "material-ui/Form";
import { BLOG_STATS } from "../../shared/queries/Queries";
import List, {
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    ListSubheader
} from "material-ui/List";
import TextField from "material-ui/TextField/TextField";
import { CREATE_POST } from "../../shared/queries/Mutations";
import Snackbar from "material-ui/Snackbar";

const Stats = stats => {
    const items = [
        {
            label: "Posts",
            value: stats.posts.published,
            icon: "collections_bookmark",
            link: "/admin/posts"
        },
        {
            label: "Pages",
            value: stats.pages.published,
            icon: "insert_drive_file",
            link: "/admin/pages"
        },
        {
            label: "Tags",
            value: stats.tags,
            icon: "label",
            link: "/admin/tags"
        },
        {
            label: "Categories",
            value: stats.categories,
            icon: "loyalty",
            link: "/admin/categories"
        }
    ];

    const data = items.map(item => (
        <div>
            <span>
                <i className="material-icons">{item.icon}</i>
            </span>
            <Link to={item.link}>
                <span>{item.value}</span>&nbsp;&nbsp;
                <span>{item.label}</span>
            </Link>
        </div>
    ));

    return <div className="listing">{data}</div>;
};

class Home extends Component {
    constructor(props) {
        super(props);
        this.draftPost = this.draftPost.bind(this);
    }

    draftPost() {
        const qsv = ele => document.querySelector(ele).value;
        this.props
            .createPost({
                title: qsv("#quick-post-title"),
                body: qsv("#quick-post-body"),
                type: "post"
            })
            .then(res => {
                console.log(res);
            });
    }

    render() {
        const style = {
            formGroup: {
                flexDirection: "row",
                marginBottom: 8
            },
            icons: {
                fontSize: 18,
                lineHeight: 1.4,
                marginRight: 16
            }
        };
        return (
            <div className="row">
                <div className="col-lg-6">
                    <Card>
                        <CardHeader
                            title="Getting started"
                            subheader="Here are some helpful links we've gathered to get you started"
                        />
                        <CardContent>
                            <div className="listing">
                                <div>
                                    <span>
                                        <i className="material-icons">
                                            settings
                                        </i>
                                    </span>
                                    <Link to="/admin/settings">
                                        Configure your settings
                                    </Link>
                                </div>
                                <div>
                                    <span>
                                        <i className="material-icons">
                                            note_add
                                        </i>
                                    </span>
                                    <Link to="/admin/post-new">
                                        Write a blog post
                                    </Link>
                                </div>
                                <div>
                                    <span>
                                        <i className="material-icons">
                                            visibility
                                        </i>
                                    </span>
                                    <Link to="/admin/post-new">
                                        View your site
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="col-lg-6">
                    <Card>
                        <CardHeader
                            title="Stats"
                            subheader="Snapshot of your blog"
                        />
                        <CardContent>
                            {!this.props.loading && (
                                <Stats {...this.props.stats} />
                            )}
                        </CardContent>
                    </Card>
                </div>
                <div className="col-lg-6">
                    <Card>
                        <CardHeader
                            title="Quick Draft"
                            subheader="Draft a quick post"
                        />
                        <CardContent>
                            <div className="form-group">
                                <TextField
                                    label="Title"
                                    fullWidth
                                    id="quick-post-title"
                                />
                            </div>
                            <div className="form-group">
                                <TextField
                                    id="quick-post-body"
                                    label="Body"
                                    fullWidth
                                    multiline
                                    rows="2"
                                    rowsMax="4"
                                    margin="normal"
                                    placeholder="Flow your thoughts..."
                                />
                            </div>
                            <Button
                                raised
                                color="primary"
                                onClick={this.draftPost}
                            >
                                Save Draft
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }
}

const ContainerWithData = graphql(BLOG_STATS, {
    props: ({ data: { loading, stats } }) => ({
        stats,
        loading
    })
});

const createPostWithData = graphql(CREATE_POST, {
    props: ({ mutate }) => ({
        createPost: data =>
            mutate({
                variables: data
            })
    })
});

export default createPostWithData(ContainerWithData(Home));
