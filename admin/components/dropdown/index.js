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
        open: false
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
            this.state.open
        ) {
            this.setState({ open: false });
        }
    };

    toggle = (e, flag) => {
        e.preventDefault();
        this.setState({ open: flag ? flag : !this.state.open });
    };

    render() {
        const { name, children, className } = this.props;
        const ddClassPublish = " dropdown" + (this.state.open ? " open" : "");

        const childrenWithProps = React.Children.map(children, child =>
            React.cloneElement(child, {
                toggleDropdown: this.toggle,
                isOpen: this.state.open
            })
        );

        return (
            <Wrapper className={className + ddClassPublish}>
                <a
                    className="dropdown-toggle"
                    href="#"
                    ref={this.ddBtnRef}
                    onClick={this.toggle}
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
