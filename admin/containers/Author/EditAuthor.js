import React, { Component } from "react";
import { graphql } from "react-apollo";
import PropTypes from "prop-types";
import { Basic, Social, PasswordChange } from "../../components/Author";
import { GET_AUTHOR } from "../../../shared/queries/Queries";
import { UPDATE_AUTHOR } from "../../../shared/queries/Mutations";
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

export default updateAuthorQuery(ContainerWithData(EditAuthor));
