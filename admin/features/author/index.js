import React, { Component } from "react";
import PropTypes from "prop-types";
import { notify } from "react-notify-toast";

import Basic from "./Basic";
import Social from "./Social";
import PasswordChange from "./PasswordChange";

import StyledSection from "../../components/section";
import StyledGrid from "../../components/grid";
import StyledCard from "../../components/card";
import StyledButton from "../../components/button";

import UpdateAuthor from "../../data-connectors/UpdateAuthor";
import { GetAuthor } from "../../data-connectors/GetAuthors";
import Loader from "../../components/loader";

class EditAuthor extends Component {
    static propTypes = {
        author: PropTypes.object,
        updateAuthor: PropTypes.func,
        loading: PropTypes.bool
    };

    author = {};

    gridLoaded = element => {
        this.textInput = element;
    };

    componentDidMount() {
        document.body.classList.add("edit-author-page");
    }

    componentWillUnmount() {
        document.body.classList.remove("edit-author-page");
    }

    setOption = (option, value) => {
        this.author[option] = value;
    };

    submitData = async e => {
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
    };

    render() {
        if (this.props.loading) {
            return <Loader />;
        }
        const { fname, lname } = this.props.author;
        return (
            <StyledSection
                title={`Edit Author - ${fname} ${lname}`}
                subtitle=""
            >
                <StyledGrid columns="repeat(auto-fit,minmax(300px, 1fr))">
                    <StyledCard>
                        <div>
                            <Basic
                                data={this.props.author}
                                updateOption={this.setOption}
                            />
                            <StyledButton success onClick={this.submitData}>
                                Save
                            </StyledButton>
                        </div>
                    </StyledCard>
                    <StyledCard>
                        <div>
                            <Social
                                data={this.props.author.social}
                                updateOption={this.setOption}
                            />
                            <StyledButton success onClick={this.submitData}>
                                Save
                            </StyledButton>
                        </div>
                    </StyledCard>
                    <StyledCard>
                        <div>
                            <PasswordChange
                                data={this.props.author}
                                updateOption={this.setOption}
                            />
                            <StyledButton success onClick={this.submitData}>
                                Save
                            </StyledButton>
                        </div>
                    </StyledCard>
                </StyledGrid>
            </StyledSection>
        );
    }
}

export default UpdateAuthor(GetAuthor(EditAuthor));
