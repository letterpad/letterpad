import React from "react";
import PropTypes from "prop-types";

/**
 * The TextMenu.
 *
 * @type {Component}
 */

export default class TextMenu extends React.Component {
    /**
     * Check if the current selection has a mark with `type` in it.
     *
     * @param {String} type
     * @return {Boolean}
     */
    static propTypes = {
        value: PropTypes.object.isRequried,
        onChange: PropTypes.func.isRequired,
        menuRef: PropTypes.object.isRequired
    };

    hasMark(type) {
        const { value } = this.props;
        return value.activeMarks.some(mark => mark.type == type);
    }

    /**
     * When a mark button is clicked, toggle the current mark.
     *
     * @param {Event} event
     * @param {String} type
     */

    onClickMark(event, type) {
        const { value, onChange } = this.props;
        event.preventDefault();
        const change = value.change().toggleMark(type);
        onChange(change);
    }

    /**
     * Render a mark-toggling toolbar button.
     *
     * @param {String} type
     * @param {String} icon
     * @return {Element}
     */

    renderMarkButton(type, icon) {
        const isActive = this.hasMark(type);
        const onMouseDown = event => this.onClickMark(event, type);

        return (
            // eslint-disable-next-line react/jsx-no-bind
            <span
                className="button"
                onMouseDown={onMouseDown}
                data-active={isActive}
            >
                <span className="material-icons">{icon}</span>
            </span>
        );
    }

    /**
     * Render.
     *
     * @return {Element}
     */

    render() {
        return (
            <div className="menu hover-menu" ref={this.props.menuRef}>
                {this.renderMarkButton("bold", "format_bold")}
                {this.renderMarkButton("italic", "format_italic")}
                {this.renderMarkButton("underline", "format_underlined")}
                {this.renderMarkButton("code", "code")}
                {this.renderMarkButton("link", "link")}
            </div>
        );
    }
}
