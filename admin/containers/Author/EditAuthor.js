import React, { Component } from "react";
import { graphql } from "react-apollo";
import PropTypes from "prop-types";
import StackGrid from "react-stack-grid";
import { Basic, Social, PasswordChange } from "../../components/Author";
import { notify } from "react-notify-toast";
import UpdateAuthor from "../../data-connectors/UpdateAuthor";
import { GetAuthor } from "../../data-connectors/GetAuthors";

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
    componentDidMount() {
        document.body.classList.add("edit-author-page");
    }

    componentWillUnmount() {
        document.body.classList.remove("edit-author-page");
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
                <StackGrid
                    className="post-grid with-padding"
                    columnWidth={"50%"}
                    gutterWidth={12}
                    gutterHeight={12}
                >
                    <div className="card">
                        <Basic
                            data={this.props.author}
                            updateOption={this.setOption}
                        />
                        <SubmitBtn handleClick={this.submitData} />
                    </div>
                    <div className="card">
                        <Social
                            data={this.props.author.social}
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
                </StackGrid>
            </section>
        );
    }
}

EditAuthor.propTypes = {
    author: PropTypes.object,
    updateAuthor: PropTypes.func,
    loading: PropTypes.bool
};

export default UpdateAuthor(GetAuthor(EditAuthor));
