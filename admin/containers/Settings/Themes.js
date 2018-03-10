import React, { Component } from "react";
import { graphql } from "react-apollo";
import PropTypes from "prop-types";
// import FontPicker from "font-picker-react";
import { ChromePicker } from "react-color";
import { UPDATE_OPTIONS } from "../../../shared/queries/Mutations";
import { GET_OPTIONS } from "../../../shared/queries/Queries";

class AddColor extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            display: false,
            color: props.colors[props.property]
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
    handleClose() {
        this.setState({ display: false });
    }

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
        <div className="col-lg-3 col-md-4 col-sm-6">
            <div className="m-b-0 card">
                <label className="custom-label">
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
const colorMap = {
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
class Themes extends Component {
    constructor(props) {
        super(props);
        this.updatedOptions = { css: "", colors: {} };
        this.submitData = this.submitData.bind(this);
        this.setOption = this.setOption.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleCssChange = this.handleCssChange.bind(this);
        this.state = {
            css: "",
            colors: { ...colorMap }
        };
        this.bc = new BroadcastChannel("test_channel");
        this.bcTrottleTimout = null;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.options.loading) {
            return false;
        }
        const data = {};
        nextProps.options.settings.forEach(setting => {
            data[setting.option] = setting;
        });
        const { css, colors } = data;
        const parsedColors = JSON.parse(colors.value);

        this.setState({
            css: css.value,
            colors: {
                ...parsedColors
            }
        });
    }

    handleChange(property, color) {
        this.state.colors[property] = color.hex;
        this.updatedOptions.colors = this.state.colors;
        clearTimeout(this.bcTrottleTimout);
        this.bcTrottleTimout = setTimeout(() => {
            this.setState(this.state);
            this.bc.postMessage({ property, color: color.hex });
        }, 50);
    }
    handleCssChange(e) {
        const css = e.target.value;
        this.setState({ css });
        this.updatedOptions.css = css;
    }

    setOption(option, value) {
        this.updatedOptions[option] = value;
    }

    submitData(e) {
        e.preventDefault();
        const settings = [];
        Object.keys(this.updatedOptions).forEach(option => {
            let value = this.updatedOptions[option];
            if (option == "colors") {
                const mergeColors = Object.assign(
                    this.state.colors,
                    this.updatedOptions.colors
                );
                value = JSON.stringify(mergeColors);
            }
            settings.push({
                option,
                value
            });
        });
        this.props.updateOptions(settings).then(res => {});
    }
    render() {
        return (
            <section className="module-xs">
                <div className="card">
                    <div className="module-title">Theme Settings</div>
                    <div className="module-subtitle">
                        You can configure your theme.
                    </div>
                </div>
                <div className="card">
                    {/* <FontPicker
                        apiKey="AIzaSyAOkdDlx49HCSBdu86oe8AD1Q7piIxlR6k" // Google API key
                        defaultFont={"Open Sans"}
                        options={{ limit: 50 }}
                        onChange={e => {
                            console.log(e);
                        }}
                    />*/}
                    <textarea
                        className="form-control"
                        rows="7"
                        placeholder="Additional CSS"
                        aria-invalid="false"
                        onChange={this.handleCssChange}
                    />
                </div>
                <div className="row">
                    <div className="color-blocks">
                        <ColorBox
                            name="Primary Color"
                            description="Color for most of the body texts"
                            state={this.state.colors}
                            property="--color-text-primary"
                            handleChange={this.handleChange}
                        />
                        <ColorBox
                            name="Secondary Color"
                            description="Color for headlines, table headers, titles, etc."
                            state={this.state.colors}
                            property="--color-text-secondary"
                            handleChange={this.handleChange}
                        />
                        <ColorBox
                            name="Primary color light"
                            description="Color for small descriptions, help texts, etc."
                            state={this.state.colors}
                            property="--color-text-primary-light"
                            handleChange={this.handleChange}
                            tip="Usually same as primary color but with a little less opacity"
                        />
                        <ColorBox
                            name="Weak color"
                            description="For places like placeholders which dont need strong visibility"
                            state={this.state.colors}
                            property="--color-text-muted"
                            handleChange={this.handleChange}
                        />
                        <ColorBox
                            name="Primary Color Invert"
                            description="Used in menu"
                            state={this.state.colors}
                            property="--color-text-primary-invert"
                            handleChange={this.handleChange}
                        />
                        <ColorBox
                            name="Secondary color light"
                            description="All input boxes, textarea, dropdowns, etc."
                            state={this.state.colors}
                            property="--color-text-secondary-light"
                            handleChange={this.handleChange}
                        />
                        <ColorBox
                            name="Accent"
                            description="Makes an element stand out like buttons, active menu, etc"
                            state={this.state.colors}
                            property="--color-accent"
                            handleChange={this.handleChange}
                        />
                        <ColorBox
                            name="Primary background color"
                            description="Background color of the whole site"
                            state={this.state.colors}
                            property="--color-bg-primary"
                            handleChange={this.handleChange}
                        />
                        <ColorBox
                            name="Secondary background color"
                            description="Background color of header, footer, menu, etc."
                            state={this.state.colors}
                            property="--color-bg-secondary"
                            handleChange={this.handleChange}
                        />
                        <ColorBox
                            name="Border colors"
                            description="Most of the borders execpt the menu"
                            state={this.state.colors}
                            property="--color-border"
                            handleChange={this.handleChange}
                        />
                        <ColorBox
                            name="Link hover colors"
                            description=""
                            state={this.state.colors}
                            property="--link-hover"
                            handleChange={this.handleChange}
                        />
                        <ColorBox
                            name="Menu Link"
                            description="Font color of menu"
                            state={this.state.colors}
                            property="--color-menu-link"
                            handleChange={this.handleChange}
                        />
                    </div>
                </div>
                <button
                    className="btn btn-blue btn-sm m-t-20"
                    onClick={this.submitData}
                >
                    Submit
                </button>
            </section>
        );
    }
}

const ContainerWithData = graphql(GET_OPTIONS, {
    name: "options"
});

const createQueryWithData = graphql(UPDATE_OPTIONS, {
    props: ({ mutate }) => {
        return {
            updateOptions: data =>
                mutate({
                    variables: { options: data },
                    updateQuery: (previousResult, { mutationResult }) => {
                        return {
                            settings: [...mutationResult.data.updatedOptions]
                        };
                    }
                    // updateQueries: {
                    //     settings: (prev, { mutationResult }) => {
                    //         return {
                    //             settings: [
                    //                 ...mutationResult.data.updatedOptions
                    //             ]
                    //         };
                    //     }
                    // }
                })
        };
    }
});
Themes.propTypes = {
    updateOptions: PropTypes.func,
    options: PropTypes.object
};
export default ContainerWithData(createQueryWithData(Themes));
