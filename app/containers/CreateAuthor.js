import React, { Component } from "react";
import { graphql } from "react-apollo";
import PropTypes from "prop-types";
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

class CreateAuthor extends Component {
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
        const update = await this.props.createAuthor(this.author);
        let { errors } = update.data.createAuthor;
        if (errors && errors.length > 0) {
            errors = errors.map(error => error.message);
            notify.show(errors.join("\n"), "error");
        } else {
            notify.show("Author created", "success");
        }
    }
    render() {
        return (
            <section className="module-xs">
                <div className="row">
                    <div className="col-md-6">
                        <div className="card">
                            <Basic
                                data={this.props.author}
                                updateOption={this.setOption}
                            />
                            <SubmitBtn handleClick={this.submitData} />
                        </div>
                        <div className="card">
                            <PasswordChange
                                data={this.props.author}
                                updateOption={this.setOption}
                            />
                            <SubmitBtn handleClick={this.submitData} />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card">
                            <Social
                                data={this.props.author.social}
                                updateOption={this.setOption}
                            />
                            <SubmitBtn handleClick={this.submitData} />
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

const updateAuthorQuery = graphql(UPDATE_AUTHOR, {
    props: ({ mutate }) => ({
        createAuthor: data =>
            mutate({
                variables: data
            })
    })
});

CreateAuthor.defaultProps = {
    author: {
        fname: "",
        lname: "",
        email: "",
        username: "",
        social: ""
    },
    createAuthor: PropTypes.func
};

export default updateAuthorQuery(CreateAuthor);
