import React, { Component } from "react";
import PropTypes from "prop-types";
import Wrapper from "./Dropdown.css";

class DropDown extends Component {
    static propTypes = {
        children: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.node),
            PropTypes.node
        ]),
        className: PropTypes.string,
        name: PropTypes.any
    };

    state = {
        isOpen: false
    };

    ddBtnRef = React.createRef();

    componentDidMount() {
        document.addEventListener("click", this.closeDropdowns);
    }

    closeDropdowns = e => {
        if (
            this.ddBtnRef.current &&
            this.ddBtnRef.current.parentNode &&
            !this.ddBtnRef.current.parentNode.contains(e.target) &&
            this.state.isOpen
        ) {
            this.setState({ isOpen: false });
        }
    };

    toggleDropdown = (e, flag) => {
        e.preventDefault();
        this.setState({ isOpen: flag ? flag : !this.state.isOpen });
    };

    render() {
        const { name, children, className } = this.props;
        const ddClassPublish = " dropdown" + (this.state.isOpen ? " open" : "");

        const childrenWithProps = React.Children.map(children, child =>
            React.cloneElement(child, {
                toggleDropdown: this.toggleDropdown,
                isOpen: this.state.isOpen
            })
        );
        return (
            <Wrapper className={className + ddClassPublish}>
                <a
                    className="dropdown-toggle"
                    href="#"
                    ref={this.ddBtnRef}
                    onClick={this.toggleDropdown}
                >
                    {name}
                    <i className="material-icons">arrow_drop_down</i>
                </a>

                <div className="dropdown-menu">{childrenWithProps}</div>
            </Wrapper>
        );
    }
}

export default DropDown;
