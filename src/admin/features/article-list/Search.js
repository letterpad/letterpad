import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import StyledInput from "../../components/input";

class Search extends PureComponent {
  static propTypes = {
    searchPosts: PropTypes.func,
    query: PropTypes.string,
  };

  searchInput = React.createRef();

  state = {
    query: this.props.query || "",
  };

  componentDidMount() {
    if (this.searchInput.current) {
      this.searchInput.current.focus();
    }
  }

  onChange = e => {
    const query = e.target.value.trim();
    this.setState({ query });
    if (query.length === 0) {
      this.handleClear();
    }
  };

  onKeyUp = e => {
    const query = e.target.value.trim();
    if (query.length > 0 && e.keyCode === 13) {
      this.props.searchPosts("query", query);
    }
  };

  handleClear = () => {
    this.props.searchPosts("query", "");
  };

  render() {
    return (
      <StyledInput
        innerRef={this.searchInput}
        focus="true"
        value={this.state.query}
        onChange={this.onChange}
        onKeyUp={this.onKeyUp}
        placeholder="Search.."
      />
    );
  }
}

export default Search;
