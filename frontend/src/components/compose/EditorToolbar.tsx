import type { Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Underline,
  Undo2,
} from "lucide-react";

interface EditorToolbarProps {
  editor: Editor | null;
}

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

function ToolbarButton({
  onClick,
  active = false,
  disabled = false,
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`
        flex h-8 w-8 items-center justify-center rounded-md transition-colors
        ${
          active
            ? "bg-blue-100 text-blue-600"
            : "text-gray-600 hover:bg-gray-100"
        }
        disabled:cursor-not-allowed
        disabled:opacity-40
      `}
    >
      {children}
    </button>
  );
}

export default function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) return null;

  const actions = [
    {
      icon: <Undo2 size={16} />,
      onClick: () => editor.chain().focus().undo().run(),
      disabled: !editor.can().chain().focus().undo().run(),
    },
    {
      icon: <Redo2 size={16} />,
      onClick: () => editor.chain().focus().redo().run(),
      disabled: !editor.can().chain().focus().redo().run(),
    },
  ];

  const formatting = [
    {
      icon: <Bold size={16} />,
      active: editor.isActive("bold"),
      onClick: () => editor.chain().focus().toggleBold().run(),
    },
    {
      icon: <Italic size={16} />,
      active: editor.isActive("italic"),
      onClick: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      icon: <Underline size={16} />,
      active: editor.isActive("underline"),
      onClick: () => editor.chain().focus().toggleUnderline().run(),
    },
    {
      icon: <List size={16} />,
      active: editor.isActive("bulletList"),
      onClick: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      icon: <ListOrdered size={16} />,
      active: editor.isActive("orderedList"),
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      icon: <Quote size={16} />,
      active: editor.isActive("blockquote"),
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
    },
  ];

  const alignment = [
    {
      icon: <AlignLeft size={16} />,
      active: editor.isActive({ textAlign: "left" }),
      onClick: () => editor.chain().focus().setTextAlign("left").run(),
    },
    {
      icon: <AlignCenter size={16} />,
      active: editor.isActive({ textAlign: "center" }),
      onClick: () => editor.chain().focus().setTextAlign("center").run(),
    },
    {
      icon: <AlignRight size={16} />,
      active: editor.isActive({ textAlign: "right" }),
      onClick: () => editor.chain().focus().setTextAlign("right").run(),
    },
  ];

  return (
    <div className="flex h-11 items-center gap-1 border-b border-gray-200 bg-gray-50 px-3">
      {actions.map((item, index) => (
        <ToolbarButton
          key={index}
          onClick={item.onClick}
          disabled={item.disabled}
        >
          {item.icon}
        </ToolbarButton>
      ))}

      <div className="mx-2 h-5 w-px bg-gray-300" />

      {formatting.map((item, index) => (
        <ToolbarButton key={index} active={item.active} onClick={item.onClick}>
          {item.icon}
        </ToolbarButton>
      ))}

      <div className="mx-2 h-5 w-px bg-gray-300" />

      {alignment.map((item, index) => (
        <ToolbarButton key={index} active={item.active} onClick={item.onClick}>
          {item.icon}
        </ToolbarButton>
      ))}
    </div>
  );
}
