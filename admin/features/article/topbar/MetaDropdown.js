import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";

import { makeUrl } from "../../../../shared/util";
import PostActions from "../PostActions";
import StyledDropdown from "./Dropdown.css";

import StyledInput from "../../../components/input";
import StyledButton from "../../../components/button";

class MetaDropdown extends Component {
    static propTypes = {
        toggleDropdown: PropTypes.func,
        post: PropTypes.object,
        isOpen: PropTypes.bool,
        updatePost: PropTypes.func.isRequired
    };

    state = {
        post: this.props.post
    };

    static getDerivedStateFromProps(newProps) {
        return {
            post: newProps.post
        };
    }

    changeSlug = e => {
        this.setState({
            post: { ...this.state.post, slug: e.target.value }
        });
        PostActions.setData({ slug: e.target.value });
    };

    render() {
        if (!this.props.isOpen) return null;
        const permalink = makeUrl([this.state.post.type, this.state.post.slug]);
        return (
            <StyledDropdown className="post-meta">
                <StyledInput
                    type="text"
                    label="Published at"
                    className="meta-value"
                    placeholder="Published date"
                    defaultValue={moment(
                        new Date(this.state.post.created_at)
                    ).format("DD-MM-Y hh:mm A")}
                />

                <StyledInput
                    type="text"
                    label="Change Path"
                    className="meta-value"
                    placeholder="Link to post"
                    defaultValue={this.state.post.slug}
                    onKeyUp={this.changeSlug}
                />

                <StyledInput
                    type="text"
                    label="Preview"
                    className="meta-value"
                    placeholder="Link to post"
                    defaultValue={permalink}
                    onClick={() => {
                        window.open(permalink);
                    }}
                />

                <StyledButton
                    onClick={e => {
                        this.props.updatePost(e, {});
                        this.props.toggleDropdown();
                    }}
                >
                    Save
                </StyledButton>
            </StyledDropdown>
        );
    }
}

export default MetaDropdown;
