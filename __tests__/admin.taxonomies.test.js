import React from "react";
import { Tags } from "../admin/components/Post/Tags";
import { shallow } from "enzyme";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { Categories } from "../admin/components/Post/Categories";
Enzyme.configure({ adapter: new Adapter() });

describe("Testing Taxonomies", () => {
    test("Creating a new tag", done => {
        const post = {
            taxonomies: []
        };
        const suggestions = [];

        const wrapper = shallow(<Tags post={post} suggestions={suggestions} />);
        wrapper.instance().handleAddition("new-tag");
        const newTagId = 0;
        expect(wrapper.instance().tags[0].id).toBe(newTagId);
        done();
    });

    test("Adding an existing tag", done => {
        const post = {
            taxonomies: []
        };
        const suggestions = [
            {
                name: "tag1",
                type: "post_tag",
                id: 1
            }
        ];

        const wrapper = shallow(<Tags post={post} suggestions={suggestions} />);
        wrapper.instance().handleAddition("tag1");
        const oldTagId = 1;
        expect(wrapper.instance().tags[0].id).toBe(oldTagId);
        done();
    });

    test("Deleting a tag", done => {
        const post = {
            taxonomies: [
                {
                    name: "tag1",
                    type: "post_tag",
                    id: 1
                }
            ]
        };
        const suggestions = [];
        const wrapper = shallow(<Tags post={post} suggestions={suggestions} />);
        const tagIndex = 0;
        wrapper.instance().handleDelete(tagIndex);

        expect(wrapper.instance().tags.length).toBe(0);
        done();
    });

    test("Creating a new category", done => {
        const post = {
            taxonomies: []
        };
        const suggestions = [];

        const wrapper = shallow(
            <Categories post={post} suggestions={suggestions} />
        );
        wrapper.instance().handleAddition("new-category");
        const newCatId = 0;
        expect(wrapper.instance().categories[0].id).toBe(newCatId);
        done();
    });

    test("Adding an existing category", done => {
        const post = {
            taxonomies: []
        };
        const suggestions = [
            {
                name: "category1",
                type: "post_category",
                id: 1
            }
        ];

        const wrapper = shallow(
            <Categories post={post} suggestions={suggestions} />
        );
        wrapper.instance().handleAddition("category1");
        const oldCatId = 1;
        expect(wrapper.instance().categories[0].id).toBe(oldCatId);
        done();
    });

    test("Deleting a category", done => {
        const post = {
            taxonomies: [
                {
                    name: "tag1",
                    type: "post_category",
                    id: 1
                }
            ]
        };
        const suggestions = [];
        const wrapper = shallow(
            <Categories post={post} suggestions={suggestions} />
        );
        const catIndex = 0;
        wrapper.instance().handleDelete(catIndex);

        expect(wrapper.instance().categories.length).toBe(0);
        done();
    });
});
