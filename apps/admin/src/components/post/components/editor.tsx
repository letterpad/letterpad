import dynamic from "next/dynamic";
import { Suspense } from "react";
import { TextBlockPlaceholder } from "ui";

const TinyMceEditor = dynamic(() => import("./tinymce/tinymce"), {
  suspense: true,
});
interface Props {
  text: string;
  onChange: (_html: string) => void;
  style?: string;
  loading?: boolean;
}
const Editor: React.VFC<Props> = ({
  text,
  onChange,
  style,
  loading = false,
}) => {
  if (loading)
    return (
      <div className="mt-4">
        <TextBlockPlaceholder />
      </div>
    );
  return (
    <Suspense
      fallback={
        <div className="mt-4">
          <TextBlockPlaceholder />
        </div>
      }
    >
      <TinyMceEditor text={text} onChange={onChange} style={style} />
    </Suspense>
  );
};
export default Editor;
