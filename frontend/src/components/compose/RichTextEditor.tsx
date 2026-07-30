import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";

import EditorToolbar from "./EditorToolbar";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: "Write your email...",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],

    content: value,

    editorProps: {
      attributes: {
        class: "min-h-[320px] px-5 py-4 text-sm text-gray-900 outline-none",
      },
    },

    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    if (editor.getHTML() !== value) {
      editor.commands.setContent(value, {
        emitUpdate: false,
      });
    }
  }, [editor, value]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-md border border-gray-200 mb-10">
      <EditorToolbar editor={editor} />

      <EditorContent className="flex-1" editor={editor} />
    </div>
  );
}