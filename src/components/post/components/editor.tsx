import dynamic from "next/dynamic";

const LetterpadEditor = dynamic(() => import("./letterpad-editor"));
const TinyMceEditor = dynamic(() => import("./tinymce/tinymce"));

const Editor = ({ text }) => {
  if (localStorage.letterpad) {
    return <LetterpadEditor text={text} />;
  }
  return <TinyMceEditor text={text} />;
};
export default Editor;
