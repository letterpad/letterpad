import React, { Component } from "react";
import Autosuggest from "react-autosuggest";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import TextField from "material-ui/TextField";
import Paper from "material-ui/Paper";
import { MenuItem } from "material-ui/Menu";
import { withStyles } from "material-ui/styles";
import PropTypes from "prop-types";

function renderInput(inputProps) {
    const {
        classes,
        autoFocus,
        value,
        ref,
        addSuggestion,
        ...other
    } = inputProps;

    return (
        <TextField
            autoFocus={autoFocus}
            className={classes.textField}
            value={value}
            inputRef={ref}
            InputProps={{
                classes: {
                    input: classes.input
                },
                ...other
            }}
            onKeyUp={e => {
                if (e.keyCode === 13 && e.target.value != "") {
                    addSuggestion(e.target.value);
                }
            }}
        />
    );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
    const matches = match(suggestion.name, query);
    const parts = parse(suggestion.name, matches);

    return (
        <MenuItem selected={isHighlighted} component="div">
            <div>
                {parts.map((part, index) => {
                    return part.highlight ? (
                        <span key={String(index)} style={{ fontWeight: 300 }}>
                            {part.text}
                        </span>
                    ) : (
                        <strong key={String(index)} style={{ fontWeight: 500 }}>
                            {part.text}
                        </strong>
                    );
                })}
            </div>
        </MenuItem>
    );
}

function renderSuggestionsContainer(options) {
    const { containerProps, children } = options;

    return (
        <Paper {...containerProps} square>
            {children}
        </Paper>
    );
}

function getSuggestionValue(suggestion) {
    return suggestion.name;
}

function getSuggestions(suggestions, value) {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;

    return inputLength === 0
        ? []
        : suggestions.filter(suggestion => {
              const keep =
                  count < 5 &&
                  suggestion.name.toLowerCase().slice(0, inputLength) ===
                      inputValue;

              if (keep) {
                  count += 1;
              }

              return keep;
          });
}

const styles = theme => ({
    container: {
        flexGrow: 1,
        position: "relative",
        height: 50
    },
    suggestionsContainerOpen: {
        position: "absolute",
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit * 3,
        left: 0,
        right: 0
    },
    suggestion: {
        display: "block"
    },
    suggestionsList: {
        margin: 0,
        padding: 0,
        listStyleType: "none"
    },
    textField: {
        width: "100%"
    }
});

class AutoComplete extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.clearSuggestions = this.clearSuggestions.bind(this);
        this.fetchSuggestions = this.fetchSuggestions.bind(this);
        this.state = {
            value: "",
            suggestions: []
        };
    }

    componentDidMount() {}

    fetchSuggestions = ({ value }) => {
        this.setState({
            suggestions: getSuggestions(this.props.suggestions, value)
        });
    };

    clearSuggestions = (e, d) => {
        this.setState({
            suggestions: []
        });
    };

    handleChange = (event, { newValue }) => {
        this.setState({
            value: newValue
        });
    };
    render() {
        const { classes } = this.props;
        return (
            <Autosuggest
                theme={{
                    container: classes.container,
                    suggestionsContainerOpen: classes.suggestionsContainerOpen,
                    suggestionsList: classes.suggestionsList,
                    suggestion: classes.suggestion
                }}
                renderInputComponent={renderInput}
                suggestions={this.props.suggestions}
                onSuggestionsFetchRequested={this.fetchSuggestions}
                onSuggestionsClearRequested={this.clearSuggestions}
                renderSuggestionsContainer={renderSuggestionsContainer}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={{
                    autoFocus: true,
                    classes,
                    placeholder: this.props.placeholder,
                    value: this.state.value,
                    onChange: this.handleChange,
                    addSuggestion: value => {
                        this.props.addSuggestion(value);
                        this.setState({ value: "" });
                    }
                }}
                onSuggestionSelected={(e, data) => {
                    this.props.addSuggestion(data.suggestionValue);
                    this.setState({ value: "" });
                }}
            />
        );
    }
}
AutoComplete.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AutoComplete);
