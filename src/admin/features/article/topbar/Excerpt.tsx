import React, { Component } from "react";

import PostActions from "../PostActions";
import { TextArea } from "../../../components/input";
import utils from "../../../../shared/util";

interface IProps {
  excerpt: string;
  html: string;
}
interface IState {
  chars: number;
  excerpt: string;
}
class Excerpt extends Component<IProps, IState> {
  maxLength = 160;

  state = {
    chars: 0,
    excerpt: this.props.excerpt,
  };

  componentDidMount() {
    let { excerpt, html } = this.props;
    const oldExcerpt = excerpt;
    if (!excerpt) {
      // the body will contain html characters. Remove all the tags and get plain text
      const tmp = document.createElement("DIV");
      tmp.innerHTML = html;

      excerpt = tmp.textContent || tmp.innerText || "";
      if (excerpt.length > this.maxLength) {
        excerpt = this.trimString(excerpt);
      }
    } else if (excerpt.length > this.maxLength) {
      excerpt = this.trimString(excerpt);
    }
    if (oldExcerpt !== excerpt) {
      this.setData(excerpt);
    }
  }

  trimString = (str: string) => {
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

  setData = (excerpt: string) => {
    this.setState({ chars: excerpt.length, excerpt });
    PostActions.setDraft({
      excerpt,
    });
    utils.debounce(PostActions.updatePost, 200)();
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
