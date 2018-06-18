import React from "react";
import { Create } from "../admin/containers/Create/Create";
import { shallow } from "enzyme";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
Enzyme.configure({ adapter: new Adapter() });

describe("Creating post", () => {
    test("Test if post gets created with new data", done => {
        const createPost = props => {
            return Promise.resolve({
                data: {
                    createPost: {
                        post: {
                            title: "draft title",
                            body: "blog post",
                            excerpt: "excerpt",
                            cover_image: "",
                            author_id: 1,
                            type: props.type,
                            status: "draft",
                            slug: "hello-world",
                            mode: "rich-text",
                            mdPreview: ""
                        }
                    }
                }
            });
        };
        const wrapper = shallow(<Create createPost={createPost} type="post" />);
        process.nextTick(() => {
            wrapper.update();
            expect(wrapper).toMatchSnapshot();
            done();
        });
    });
});
