import React from "react";
import { Create } from "../admin/containers/Create/Create";
import { PostPublish } from "../admin/components/Post/PostPublish";
import { shallow } from "enzyme";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { PostActions } from "../admin/components/Post";
Enzyme.configure({ adapter: new Adapter() });

describe("Creating post", () => {
    test("Test if post gets created with new data", done => {
        const createPost = props => {
            return Promise.resolve({
                data: {
                    createPost: {
                        post: {
                            title: "",
                            type: props.type
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

    // test("Test if post gets Updated", done => {
    //     const post = {
    //         title: "draft title",
    //         body: "blog post",
    //         excerpt: "excerpt",
    //         cover_image: "",
    //         author_id: 1,
    //         type: "post",
    //         status: "draft",
    //         slug: "hello-world",
    //         mode: "rich-text"
    //     };

    //     const wrapper = shallow(
    //         <PostPublish
    //             post={post}
    //             history={{
    //                 push: () => {
    //                     done(); // this should run for the test to pass.
    //                 }
    //             }}
    //             update={data => {
    //                 return Promise.resolve({
    //                     data: {
    //                         updatePost: {
    //                             ok: true,
    //                             post: data
    //                         }
    //                     }
    //                 });
    //             }}
    //         />
    //     );
    //     wrapper
    //         .find(".publish-btn")
    //         .first()
    //         .simulate("click");
    // });
});
