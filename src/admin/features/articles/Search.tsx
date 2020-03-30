import React, { ChangeEvent, PureComponent } from "react";

import styled from "styled-components";

class Search extends PureComponent<any, any> {
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
    const query = e.target.value;
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
      <Container>
        <input
          ref={this.searchInput}
          value={this.state.query}
          onChange={this.onChange}
          onKeyUp={this.onKeyUp}
          placeholder="Search.."
        />
        <i className="fa fa-search"></i>
      </Container>
    );
  }
}

export default Search;

const Container = styled.div`
  input {
    padding: 11.5px;
    border: 1px solid var(--color-border);
    border-radius: 2px;
    background: transparent;
    color: var(--color-base);
  }
  i {
    left: -20px;
  }
`;
