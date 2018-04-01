import React, { Component } from "react";
import { graphql } from "react-apollo";
import PropTypes from "prop-types";
import { Basic, Social, PasswordChange } from "../../components/Author";
import { notify } from "react-notify-toast";
import GetRoles from "../../data-connectors/GetRoles";
import CreateAuthorConnector from "../../data-connectors/CreateAuthorConnector";

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
        this.selectRole = this.selectRole.bind(this);
        document.body.classList.add("create-author-page");
    }
    componentWillUnmount() {
        document.body.classList.remove("create-author-page");
    }

    selectRole(e) {
        this.setOption("role_id", e.target.value);
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
            this.props.history.push("/admin/authors");
        }
    }
    render() {
        if (this.props.loading) {
            return <div>Loading..</div>;
        }
        return (
            <section className="module-xs">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <Basic data={{}} updateOption={this.setOption} />
                            <div className="form-group">
                                <label className="custom-label">Role</label>
                                <select
                                    ref={ele =>
                                        ele &&
                                        this.setOption("role_id", ele.value)
                                    }
                                    defaultValue={4}
                                    onChange={this.selectRole}
                                    className="form-control"
                                >
                                    {this.props.roles.map((role, i) => (
                                        <option key={i} value={role.id}>
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <SubmitBtn handleClick={this.submitData} />
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

CreateAuthor.defaultProps = {
    author: {
        fname: "",
        lname: "",
        email: ""
    },
    createAuthor: PropTypes.func
};

export default CreateAuthorConnector(GetRoles(CreateAuthor));
