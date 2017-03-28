import React, { Component } from "react";
import { ChromePicker } from "react-color";

class Item extends Component {
    render() {
        let styles = {
            popover: {
                position: "absolute",
                zIndex: "2"
            }
        };
        return (
            <div className="theme-customizer">
                <div
                    className="swatch"
                    onClick={() => this.props.handleClick(this.props.name)}
                >
                    <div
                        style={{
                            width: "36px",
                            height: "14px",
                            borderRadius: "2px",
                            background: this.props.item.color
                        }}
                    />
                </div>
                {this.props.item.display
                    ? <div style={styles.popover}>
                          <div
                              className="cover"
                              onClick={() =>
                                  this.props.handleClose(this.props.name)}
                          />
                          <ChromePicker
                              color={this.props.item.color}
                              onChange={color =>
                                  this.props.handleChange(
                                      this.props.name,
                                      color
                                  )}
                          />
                      </div>
                    : null}
            </div>
        );
    }
}
export default class Theme extends Component {
    constructor(props) {
        super(props);
        this.updateOption = this.updateOption.bind(this);
        this.state = {
            theme_menu_bg: {
                display: false,
                color: "rgba(197, 187, 179, 0.69)"
            },
            theme_bg: {
                display: false,
                color: "rgba(197, 187, 179, 0.69)"
            },
            theme_header: {
                display: false,
                color: "rgba(197, 187, 179, 0.69)"
            }
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        for (let i in this.state) {
            this.state[i].color = this.props.data[i].value;
        }
        this.setState(this.state);
    }

    handleClick(item) {
        this.state[item].display = !this.state[item].display;
        this.setState(this.state);
    }
    handleClose(item) {
        this.state[item].display = false;
        this.setState(this.state);
    }
    handleChange(item, color) {
        color = `rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b},${color.rgb.a})`;
        if (item == "theme_menu_bg") {
            document.querySelector(".sidebar").style.backgroundColor = color;
        } else if (item == "theme_bg") {
            document.querySelector("body").style.backgroundColor = color;
        }
        this.state[item].color = color;
        this.setState(this.state);
        this.updateOption(item, color);
    }
    updateOption(option, value) {
        this.props.updateOption(option, value);
    }
    render() {
        return (
            <div>
                <div className="form-group">
                    <label className="custom-label">
                        Menu Background
                    </label>
                    <Item
                        name="theme_menu_bg"
                        item={this.state.theme_menu_bg}
                        handleClick={this.handleClick}
                        handleClose={this.handleClose}
                        handleChange={this.handleChange}
                    />
                </div>
                <div className="form-group">
                    <label className="custom-label">
                        Background
                    </label>
                    <Item
                        name="theme_bg"
                        item={this.state.theme_bg}
                        handleClick={this.handleClick}
                        handleClose={this.handleClose}
                        handleChange={this.handleChange}
                    />
                </div>
                <div className="form-group">
                    <label className="custom-label">
                        Header
                    </label>
                    <Item
                        name="theme_header"
                        item={this.state.theme_header}
                        handleClick={this.handleClick}
                        handleClose={this.handleClose}
                        handleChange={this.handleChange}
                    />
                </div>
                <div className="form-group">
                    <label className="custom-label">
                        Logo
                    </label>
                    <input
                        defaultValue={this.props.data.theme_logo.value}
                        type="text"
                        className="form-control"
                        placeholder="Enter your instagram link.."
                        aria-invalid="true"
                        onBlur={e =>
                            this.updateOption("theme_logo", e.target.value)}
                    />
                </div>
            </div>
        );
    }
}
