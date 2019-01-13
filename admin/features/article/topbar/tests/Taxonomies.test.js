import React from "react";
import { shallow } from "enzyme";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { Taxonomies } from "../Taxonomies";
Enzyme.configure({ adapter: new Adapter() });

describe("Testing Taxonomies", () => {
  test("Creating a new tag", done => {
    const post = {
      taxonomies: [],
    };
    const suggestions = [];

    const wrapper = shallow(
      <Taxonomies for="post_tag" post={post} suggestions={suggestions} />,
    );

    wrapper.instance().handleOnChange([{ name: "new-tag" }]);
    const newTagId = 0;
    expect(wrapper.state().tags[0].id).toBe(newTagId);
    done();
  });

  test("Deleting a tag", done => {
    const post = {
      taxonomies: [
        {
          name: "tag1",
          type: "post_tag",
          id: 1,
        },
      ],
    };
    const suggestions = [];
    const wrapper = shallow(
      <Taxonomies for="post_tag" post={post} suggestions={suggestions} />,
    );
    wrapper.instance().handleOnChange([]);

    expect(wrapper.state().tags.length).toBe(0);
    done();
  });

  test("Creating a new category", done => {
    const post = {
      taxonomies: [],
    };
    const suggestions = [];

    const wrapper = shallow(
      <Taxonomies for="post_category" post={post} suggestions={suggestions} />,
    );
    wrapper.instance().handleOnChange([{ name: "new-category" }]);
    const newCatId = 0;
    expect(wrapper.state().tags[0].id).toBe(newCatId);
    done();
  });

  test("Deleting a category", done => {
    const post = {
      taxonomies: [
        {
          name: "tag1",
          type: "post_category",
          id: 1,
        },
      ],
    };
    const suggestions = [];
    const wrapper = shallow(
      <Taxonomies for="post_category" post={post} suggestions={suggestions} />,
    );
    wrapper.instance().handleOnChange([]);

    expect(wrapper.state().tags.length).toBe(0);
    done();
  });
});
