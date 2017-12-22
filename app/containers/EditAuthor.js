import React, { Component } from "react";
import { gql, graphql, compose } from "react-apollo";
import Basic from "../components/authors/Basic";
import Social from "../components/authors/Social";
import PasswordChange from "../components/authors/PasswordChange";
import { GET_AUTHOR } from "../../shared/queries/Queries";
import { UPDATE_AUTHOR } from "../../shared/queries/Mutations";
import { notify } from "react-notify-toast";

const SubmitBtn = ({ handleClick }) => {
    return (
        <button
            type="submit"
            onClick={handleClick}
            className="btn btn-blue btn-sm"
        >
            Save
        </button>
    );
};

class EditAuthor extends Component {
    constructor(props) {
        super(props);
        this.author = {};
        this.submitData = this.submitData.bind(this);
    }

    updateOption(option, value) {
        this.author[option] = value;
    }

    async submitData(e) {
        this.author.id = this.props.author.id;
        console.log(this.author);
        e.preventDefault();
        let update = await this.props.updateAuthor(this.author);
        let errors = update.data.updateAuthor.errors;
        if (errors && errors.length > 0) {
            errors = errors.map(error => error.message);
            notify.show(errors.join("\n"), "error");
        } else {
            notify.show("Author updated", "success");
        }
    }
    render() {
        let data = {};
        if (this.props.loading) {
            return <div>hello</div>;
        }

        return (
            <section className="module-xs">
                <div className="row">
                    <div className="col-md-6">
                        <div className="card">
                            <Basic
                                data={this.props.author}
                                updateOption={this.updateOption.bind(this)}
                            />
                            <SubmitBtn handleClick={this.submitData} />
                        </div>
                        <div className="card">
                            <PasswordChange
                                data={this.props.author}
                                updateOption={this.updateOption.bind(this)}
                            />
                            <SubmitBtn handleClick={this.submitData} />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card">
                            <Social
                                data={this.props.author.social}
                                updateOption={this.updateOption.bind(this)}
                            />
                            <SubmitBtn handleClick={this.submitData} />
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

const ContainerWithData = graphql(GET_AUTHOR, {
    options: props => {
        return {
            variables: {
                id: props.params.id
            }
        };
    },
    props: ({ data: { loading, author } }) => ({
        author,
        loading
    })
});

const updateAuthorQuery = graphql(UPDATE_AUTHOR, {
    props: ({ mutate }) => {
        return {
            updateAuthor: data =>
                mutate({
                    variables: data
                })
        };
    }
});

export default updateAuthorQuery(ContainerWithData(EditAuthor));
