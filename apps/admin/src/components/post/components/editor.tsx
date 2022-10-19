import dynamic from "next/dynamic";

const TinyMceEditor = dynamic(() => import("./tinymce/tinymce"));

interface Props {
  text: string;
  onChange: (_html: string) => void;
}
const Editor: React.VFC<Props> = ({ text, onChange }) => {
  return <TinyMceEditor text={text} onChange={onChange} />;
};
export default Editor;
