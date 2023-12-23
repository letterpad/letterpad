import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import { createLowlight } from "lowlight";
import dynamic from "next/dynamic";
import { FC, Suspense } from "react";
import { TextBlockPlaceholder } from "ui";
const lowlight = createLowlight();

lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("js", js);
lowlight.register("ts", ts);

const Highlight = CodeBlockLowlight.configure({
  lowlight,
});

const TinyMceEditor = dynamic(() => import("./tinymce/tinymce"), {
  suspense: true,
});
interface Props {
  text: string;
  onChange: (_html: string) => void;
  style?: string;
  loading?: boolean;
}
export const Editor: FC<Props> = ({
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
