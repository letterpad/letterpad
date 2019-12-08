import React, { PureComponent, ChangeEvent } from "react";

import Input from "../../components/input";

class Search extends PureComponent<any, any> {
  // static propTypes = {
  //   searchPosts: PropTypes.func,
  //   query: PropTypes.string,
  // };

  searchInput = React.createRef<HTMLInputElement>();

  state = {
    query: this.props.query || "",
  };

  componentDidMount() {
    if (this.searchInput.current) {
      this.searchInput.current.focus();
    }
  }

  onChange = (e: ChangeEvent<HTMLInputElement>) => {
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
      <Input
        ref={this.searchInput}
        value={this.state.query}
        onChange={this.onChange}
        onKeyUp={this.onKeyUp}
        placeholder="Search.."
      />
    );
  }
}

export default Search;
