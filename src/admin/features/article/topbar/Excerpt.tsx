import React, { Component } from "react";
import PropTypes from "prop-types";

import PostActions from "../PostActions";
import { TextArea } from "../../../components/input";

class Excerpt extends Component<any, any> {
  static propTypes = {
    post: PropTypes.object,
  };

  maxLength = 160;

  state = {
    chars: 0,
    excerpt: "",
  };

  componentDidMount() {
    let { excerpt } = this.props.post;
    if (!excerpt) {
      // the body will contain html characters. Remove all the tags and get plain text
      let html = this.props.post.body;
      const tmp = document.createElement("DIV");
      tmp.innerHTML = html;

      excerpt = tmp.textContent || tmp.innerText || "";
      if (excerpt.length > this.maxLength) {
        excerpt = this.trimString(excerpt);
      }
    } else if (excerpt.length > this.maxLength) {
      excerpt = this.trimString(excerpt);
    }
    this.setData(excerpt);
  }

  trimString = str => {
    //trim the string to the maximum length
    let trimmedString = str.substr(0, this.maxLength);
    //re-trim if we are in the middle of a word
    return (
      trimmedString.substr(
        0,
        Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")),
      ) + "..."
    );
  };

  setData = excerpt => {
    this.setState({ chars: excerpt.length, excerpt });
    PostActions.setData({
      excerpt,
    });
  };

  render() {
    return (
      <div>
        <TextArea
          label={`Write a small introduction about this post - [${this.state.chars}/160]`}
          maxLength={160}
          placeholder="Write a small description"
          value={this.state.excerpt}
          onChange={e => {
            this.setData(e.target.value);
          }}
        />
      </div>
    );
  }
}

export default Excerpt;
