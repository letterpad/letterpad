import React, { Component } from "react";
import { graphql, compose } from "react-apollo";
import PropTypes from "prop-types";
import { UPDATE_OPTIONS } from "../../shared/queries/Mutations";
import { ChromePicker } from "react-color";

class AddColor extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            display: false,
            color: "#FFF"
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.colors[nextProps.property] !== this.state.color) {
            this.setState({ color: nextProps.colors[nextProps.property] });
        }
    }

    handleChange(color) {
        this.setState({ color: color.hex });
        this.props.handleChange(this.props.property, color);
    }

    handleClick() {
        this.setState({ display: !this.state.display });
    }
    handleClose = () => {
        this.setState({ display: false });
    };

    render() {
        const style = {
            background: this.state.color.hex || this.state.color
        };
        return (
            <div id="cp-css">
                <div className="cp-swatch" onClick={this.handleClick}>
                    <div className="color-box" style={style} />
                </div>
                {this.state.display ? (
                    <div className="cp-popover">
                        <div className="cp-cover" onClick={this.handleClose} />
                        <ChromePicker
                            color={this.state.color}
                            onChange={this.handleChange}
                        />
                    </div>
                ) : null}
            </div>
        );
    }
}

const ColorBox = ({ name, description, property, handleChange, state }) => {
    return (
        <div className="col-lg-4">
            <div className="form-group card">
                <label classNmae="custom-label">
                    {name}
                    <AddColor
                        colors={state}
                        property={property}
                        handleChange={handleChange}
                    />
                </label>

                <div className="text-muted">{description}</div>
            </div>
        </div>
    );
};

class Themes extends Component {
    constructor(props) {
        super(props);
        this.updatedOptions = {};
        this.submitData = this.submitData.bind(this);
        this.setOption = this.setOption.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            "--color-text-primary": "transparent",
            "--color-text-primary-invert": "transparent",
            "--color-text-primary-light": "transparent",
            "--color-text-muted": "transparent",
            "--color-text-secondary": "transparent",
            "--color-text-secondary-light": "transparent",
            "--color-accent": "transparent",
            "--color-bg-primary": "transparent",
            "--color-bg-secondary": "transparent",
            "--color-border": "transparent",
            "--link-hover": "transparent",
            "--color-menu-link": "transparent"
        };
    }
    componentDidMount() {
        if (typeof window !== "undefined") {
            setTimeout(() => {
                let properties = window.getComputedStyle(document.body);
                const get = prop => properties.getPropertyValue(prop);

                this.state = {
                    "--color-text-primary": get("--color-text-primary"),
                    "--color-text-primary-invert": get(
                        "--color-text-primary-invert"
                    ),
                    "--color-text-primary-light": get(
                        "--color-text-primary-light"
                    ),
                    "--color-text-muted": get("--color-text-muted"),
                    "--color-text-secondary": get("--color-text-secondary"),
                    "--color-text-secondary-light": get(
                        "--color-text-secondary-light"
                    ),
                    "--color-accent": get("--color-accent"),
                    "--color-bg-primary": get("--color-bg-primary"),
                    "--color-bg-secondary": get("--color-bg-secondary"),
                    "--color-border": get("--color-border"),
                    "--link-hover": get("--link-hover"),
                    "--color-menu-link": get("--color-menu-link")
                };
                this.setState(this.state);
            }, 1000);
        }
    }

    handleChange(property, color) {
        document.querySelector(":root").style.setProperty(property, color.hex);
        this.state[property] = color;
        this.setState(this.state);
    }

    setOption(option, value) {
        this.updatedOptions[option] = value;
    }

    submitData(e) {
        e.preventDefault();
        const settings = [];
        Object.keys(this.updatedOptions).forEach(option => {
            settings.push({
                option,
                value: this.updatedOptions[option]
            });
        });
        this.props.updateOptions(settings).then(res => {});
    }
    render() {
        const data = {};

        // this.props.options.settings.forEach(setting => {
        //     data[setting.option] = setting;
        // });

        return (
            <section className="module-xs">
                <div className="card">
                    <div className="module-title">Theme Settings</div>
                    <div className="module-subtitle">
                        You can configure your theme.
                    </div>
                </div>
                <div className="card">
                    <textarea
                        className="form-control"
                        rows="7"
                        placeholder="Additional CSS"
                        aria-invalid="false"
                    />
                </div>
                <div className="row">
                    <div className="col-lg-8 color-blocks">
                        <div className="row">
                            <ColorBox
                                name="Primary Color"
                                description="Color for most of the body texts"
                                state={this.state}
                                property="--color-text-primary"
                                handleChange={this.handleChange}
                            />
                            <ColorBox
                                name="Secondary Color"
                                description="Color for headlines, table headers, titles, etc."
                                state={this.state}
                                property="--color-text-secondary"
                                handleChange={this.handleChange}
                            />
                            <ColorBox
                                name="Primary color light"
                                description="Color for small descriptions, help texts, etc."
                                state={this.state}
                                property="--color-text-primary-light"
                                handleChange={this.handleChange}
                                tip="Usually same as primary color but with a little less opacity"
                            />
                            <ColorBox
                                name="Weak color"
                                description="For places like placeholders which dont need strong visibility"
                                state={this.state}
                                property="--color-text-muted"
                                handleChange={this.handleChange}
                            />
                            <ColorBox
                                name="Primary Color Invert"
                                description="Used in menu"
                                state={this.state}
                                property="--color-text-primary-invert"
                                handleChange={this.handleChange}
                            />
                            <ColorBox
                                name="Secondary color light"
                                description="All input boxes, textarea, dropdowns, etc."
                                state={this.state}
                                property="--color-text-secondary-light"
                                handleChange={this.handleChange}
                            />
                            <ColorBox
                                name="Accent"
                                description="Makes an element stand out like buttons, active menu, etc"
                                state={this.state}
                                property="--color-accent"
                                handleChange={this.handleChange}
                            />
                            <ColorBox
                                name="Primary background color"
                                description="Background color of the whole site"
                                state={this.state}
                                property="--color-bg-primary"
                                handleChange={this.handleChange}
                            />
                            <ColorBox
                                name="Secondary background color"
                                description="Background color of header, footer, menu, etc."
                                state={this.state}
                                property="--color-bg-secondary"
                                handleChange={this.handleChange}
                            />
                            <ColorBox
                                name="Border colors"
                                description="Most of the borders execpt the menu"
                                state={this.state}
                                property="--color-border"
                                handleChange={this.handleChange}
                            />
                            <ColorBox
                                name="Link hover colors"
                                description=""
                                state={this.state}
                                property="--link-hover"
                                handleChange={this.handleChange}
                            />
                            <ColorBox
                                name="Menu Link"
                                description="Font color of menu"
                                state={this.state}
                                property="--color-menu-link"
                                handleChange={this.handleChange}
                            />
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="card">Typography</div>
                    </div>
                </div>
                <button
                    className="btn btn-blue btn-sm"
                    handleClick={this.submitData}
                >
                    Submit
                </button>
            </section>
        );
    }
}
export default Themes;
