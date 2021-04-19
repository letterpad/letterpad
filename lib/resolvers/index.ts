import Author from "./author";
import Media from "./media";
import Setting from "./setting";
import Post from "./post.query.resolver";
import PostMutation from "./post.mutation.resolver";

export default [Author, Post, PostMutation, Setting, Media];
