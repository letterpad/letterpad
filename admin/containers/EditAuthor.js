import React, { Component } from "react";
import { graphql } from "react-apollo";
import PropTypes from "prop-types";
import Basic from "../components/authors/Basic";
import Social from "../components/authors/Social";
import PasswordChange from "../components/authors/PasswordChange";
import { GET_AUTHOR, GET_ROLES } from "../../shared/queries/Queries";
import { UPDATE_AUTHOR } from "../../shared/queries/Mutations";
import { notify } from "react-notify-toast";
import Card, { CardHeader, CardContent, CardActions } from "material-ui/Card";
import Button from "material-ui/Button";

const SubmitBtn = ({ handleClick }) => {
    return (
        <CardActions>
            <Button mini={true} raised color="primary" onClick={handleClick}>
                Save
            </Button>
        </CardActions>
    );
};

class EditAuthor extends Component {
    constructor(props) {
        super(props);
        this.author = {};
        this.submitData = this.submitData.bind(this);
        this.setOption = this.setOption.bind(this);
    }

    setOption(option, value) {
        this.author[option] = value;
    }

    async submitData(e) {
        e.preventDefault();
        this.author.id = this.props.author.id;
        const update = await this.props.updateAuthor(this.author);
        let { errors } = update.data.updateAuthor;
        if (errors && errors.length > 0) {
            errors = errors.map(error => error.message);
            notify.show(errors.join("\n"), "error");
        } else {
            notify.show("Author updated", "success");
        }
    }
    render() {
        if (this.props.loading || this.props.roles.loading) {
            return <div>hello</div>;
        }

        return (
            <div>
                <div className="row">
                    <div className="col-md-6">
                        <Card>
                            <CardHeader
                                title="Basic Information"
                                subheader="Some basic information about yourself"
                            />
                            <CardContent>
                                <Basic
                                    data={this.props.author}
                                    updateOption={this.setOption}
                                    roles={this.props.roles.roles}
                                />
                                <SubmitBtn handleClick={this.submitData} />
                            </CardContent>
                        </Card>

                        <br />
                        <Card>
                            <CardHeader
                                title="Change Password"
                                subheader="Change your password"
                            />
                            <CardContent>
                                <PasswordChange
                                    data={this.props.author}
                                    updateOption={this.setOption}
                                />
                                <SubmitBtn handleClick={this.submitData} />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="col-md-6">
                        <Card>
                            <CardHeader
                                title="Social Information"
                                subheader="Other will be able to discover you"
                            />
                            <CardContent>
                                <Social
                                    data={this.props.author.social}
                                    updateOption={this.setOption}
                                />
                                <SubmitBtn handleClick={this.submitData} />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }
}

const ContainerWithData = graphql(GET_AUTHOR, {
    options: props => {
        return {
            variables: {
                id: props.match.params.id || props.author.id
            }
        };
    },
    props: ({ data: { loading, author } }) => ({
        author,
        loading
    })
});

const ContainerWithRoles = graphql(GET_ROLES, {
    name: "roles"
});

const updateAuthorQuery = graphql(UPDATE_AUTHOR, {
    props: ({ mutate }) => ({
        updateAuthor: data =>
            mutate({
                variables: data
            })
    })
});

EditAuthor.propTypes = {
    author: PropTypes.object,
    updateAuthor: PropTypes.func,
    loading: PropTypes.bool
};

export default updateAuthorQuery(
    ContainerWithRoles(ContainerWithData(EditAuthor))
);
