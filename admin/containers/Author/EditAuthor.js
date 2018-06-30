import React, { Component } from "react";
import PropTypes from "prop-types";
import { notify } from "react-notify-toast";

import { Basic, Social, PasswordChange } from "../../components/Author";
import UpdateAuthor from "../../data-connectors/UpdateAuthor";
import { GetAuthor } from "../../data-connectors/GetAuthors";
import Loader from "../../components/Loader";
import SaveButton from "./SaveButton";

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
        setTimeout(() => {
            const elem = document.querySelector(".masonry-grid");
            new Masonry(elem, {
                itemSelector: ".masonry-grid-item",
                gutter: 12
            });
        }, 300);
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

        return (
            <section className="module-xs">
                <div className="masonry-grid">
                    <div className="card masonry-grid-item">
                        <Basic
                            data={this.props.author}
                            updateOption={this.setOption}
                        />
                        <SaveButton handleClick={this.submitData} />
                    </div>
                    <div className="card masonry-grid-item">
                        <Social
                            data={this.props.author.social}
                            updateOption={this.setOption}
                        />
                        <SaveButton handleClick={this.submitData} />
                    </div>
                    <div className="card masonry-grid-item">
                        <PasswordChange
                            data={this.props.author}
                            updateOption={this.setOption}
                        />
                        <SaveButton handleClick={this.submitData} />
                    </div>
                </div>
            </section>
        );
    }
}

export default UpdateAuthor(GetAuthor(EditAuthor));
