import dynamic from "next/dynamic";

const TinyMceEditor = dynamic(() => import("./tinymce/tinymce"));

interface Props {
  text: string;
  onChange: (_html: string) => void;
  style?: string;
}
const Editor: React.VFC<Props> = ({ text, onChange, style }) => {
  return <TinyMceEditor text={text} onChange={onChange} style={style} />;
};
export default Editor;
