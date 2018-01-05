import React, { Component } from "react";
import { notify } from "react-notify-toast";
import PostActions from "./PostActions";
import { gql, graphql } from "react-apollo";
import moment from "moment";
import siteConfig from "../../../config/site.config";
import { UPDATE_POST_QUERY } from "../../../shared/queries/Mutations";
import Toggle from "material-ui/Toggle";
import TextField from "material-ui/TextField";
import FlatButton from "material-ui/FlatButton";
import {
    Card,
    CardActions,
    CardHeader,
    CardMedia,
    CardTitle,
    CardText
} from "material-ui/Card";
import DatePicker from "material-ui/DatePicker";

const actions = {
    publish: "Published",
    draft: "Save Draft"
};
class PostPublish extends Component {
    constructor(props) {
        super(props);
        this.changePostStatus = this.changePostStatus.bind(this);
        this.changeSlug = this.changeSlug.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.state = {
            post: this.props.post,
            published: 1
        };
    }
    componentWillReceiveProps(nextProps) {
        const status = nextProps.post.status == "publish" ? 1 : 0;
        this.setState({ published: status });
    }

    componentDidMount() {
        PostActions.setData(this.props.post);
        if (this.props.post.created_at) {
            this.state.post.created_at = moment(
                new Date(this.props.post.created_at)
            ).format("DD-MM-Y hh:mm A");
            this.setState(this.state);
        }
    }

    changePostStatus(e, checked) {
        this.setState({
            published: ~~checked
        });
    }
    changeSlug(e) {
        this.state.post.slug = e.target.value;
        this.setState(this.state);
        PostActions.setData({ slug: this.state.post.slug });
    }
    handleDateChange(e) {
        this.state.post.created_at = e.target.value;
        this.setState(this.state);
    }

    async updatePost(e, status) {
        e.preventDefault();
        PostActions.setData(status);
        let data = PostActions.getData();
        const update = await this.props.update({
            ...this.props.post,
            ...data
        });
        if (update.data.updatePost.ok) {
            // If any component has subscribed to get notifications on update/delete, it will be notified.
            PostActions.postUpdated(update.data.updatePost.post);
            if (this.props.create) {
                return notify.show("Post created", "success", 3000);
            }
            if (this.props.post.status === "trash") {
                return notify.show("Post trashed", "success", 3000);
            }
            this.setState({ post: update.data.updatePost.post });
            return notify.show("Post updated", "success", 3000);
        }
        let errors = update.data.updatePost.errors;
        if (errors && errors.length > 0) {
            errors = errors.map(error => error.message);
            notify.show(errore.join("\n"), "error", 3000);
        }
    }

    getButton(label, status, isPrimary) {
        if (typeof status == "undefined") {
            status = this.state.published ? "publish" : "draft";
        }

        return (
            <FlatButton
                onClick={e => this.updatePost(e, { status: status })}
                primary={isPrimary}
                label={label}
            />
        );
    }

    render() {
        const publishedCls = this.state.published ? "on" : "off";
        const permalink =
            siteConfig.root_url +
            this.state.post.type +
            "/" +
            this.state.post.slug;
        const actionLabel = this.props.create ? "Create" : "Update";
        return (
            <Card>
                <CardHeader title="Publishing" />
                <CardText>
                    <div className={"switch-block m-b-20 " + publishedCls}>
                        <span className="switch-label switch-off-text">
                            Draft
                        </span>
                        <Toggle
                            style={{ width: "initial", marginRight: 10 }}
                            onToggle={this.changePostStatus}
                            defaultToggled={!!this.state.published}
                        />
                        <span className="switch-label switch-on-text">
                            Publish
                        </span>
                    </div>
                    <div className="x_content m-b-20">
                        <label className="custom-label">
                            <i className="fa fa fa-calendar" /> Published at
                        </label>
                        <TextField
                            value={this.state.post.created_at}
                            hintText="Published date"
                            onChange={this.handleDateChange}
                            fullWidth={true}
                        />
                    </div>
                    <div className="x_content m-b-20">
                        <label className="custom-label">
                            <i className="fa fa fa-link" /> Slug
                        </label>
                        <TextField
                            value={this.state.post.slug}
                            hintText="Slug"
                            onChange={this.changeSlug}
                            fullWidth={true}
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
                </CardText>
                <CardActions>
                    {this.getButton(actionLabel, "publish", true)}
                    {this.getButton("Trash", "draft", false)}
                </CardActions>
            </Card>
        );
    }
}

const updateQueryWithData = graphql(UPDATE_POST_QUERY, {
    props: ({ mutate }) => ({
        update: data =>
            mutate({
                variables: data,
                updateQueries: {
                    getPost: (prev, { mutationResult }) => {
                        return {
                            post: {
                                ...prev.post,
                                ...mutationResult.data.updatePost.post
                            }
                        };
                    }
                }
            })
    })
});
export default updateQueryWithData(PostPublish);
