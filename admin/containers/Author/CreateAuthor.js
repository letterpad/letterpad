import React, { Component } from "react";
import PropTypes from "prop-types";
import { Basic } from "../../components/Author";
import { notify } from "react-notify-toast";
import GetRoles from "../../data-connectors/GetRoles";
import CreateAuthorConnector from "../../data-connectors/CreateAuthorConnector";
import Loader from "../../components/Loader";
import SaveButton from "./SaveButton";

class CreateAuthor extends Component {
    static defaultProps = {
        author: {
            fname: "",
            lname: "",
            email: ""
        }
    };
    static propTypes = {
        author: PropTypes.object,
        history: PropTypes.object,
        createAuthor: PropTypes.func,
        loading: PropTypes.bool,
        roles: PropTypes.array
    };
    
    constructor(props) {
        super(props);
        this.author = {};
        document.body.classList.add("create-author-page");
    }
    componentWillUnmount() {
        document.body.classList.remove("create-author-page");
    }

    selectRole = e => {
        this.setOption("role_id", e.target.value);
    };

    setOption = (option, value) => {
        this.author[option] = value;
    };

    submitData = async e => {
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
    };

    render() {
        if (this.props.loading) {
            return <Loader />;
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
                            <SaveButton handleClick={this.submitData} />
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default CreateAuthorConnector(GetRoles(CreateAuthor));
