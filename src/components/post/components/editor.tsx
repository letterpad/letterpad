import dynamic from "next/dynamic";

const TinyMceEditor = dynamic(() => import("./tinymce/tinymce"));

interface Props {
  text: string;
  postId?: number;
}
const Editor: React.VFC<Props> = ({ text, postId }) => {
  return <TinyMceEditor text={text} postId={postId} />;
};
export default Editor;
