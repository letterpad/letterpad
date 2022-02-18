import dynamic from "next/dynamic";

const LetterpadEditor = dynamic(() => import("./letterpad-editor"));
const TinyMceEditor = dynamic(() => import("./tinymce/tinymce"));

const Editor = ({ text }) => {
  if (localStorage.tinymce) {
    return <TinyMceEditor text={text} />;
  }
  return <LetterpadEditor text={text} />;
};
export default Editor;
