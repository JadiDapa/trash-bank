"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Link2,
  Link2Off,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  content?: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

function ToolbarBtn({
  onClick,
  isActive,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-md text-sm transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        "disabled:pointer-events-none disabled:opacity-40",
        isActive && "bg-accent text-accent-foreground",
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="bg-border mx-1 w-px self-stretch" />;
}

export default function TiptapEditor({
  content = "",
  onChange,
  placeholder = "Tulis isi artikel...",
}: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
      Link.configure({ openOnClick: false }),
      Underline,
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  function handleAddLink() {
    const url = window.prompt("Masukkan URL:");
    if (url) {
      editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  }

  return (
    <div className="bg-background overflow-hidden rounded-lg border">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b p-2">
        <ToolbarBtn
          title="Tebal (Ctrl+B)"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          isActive={editor?.isActive("bold")}
        >
          <Bold className="size-4" />
        </ToolbarBtn>
        <ToolbarBtn
          title="Miring (Ctrl+I)"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          isActive={editor?.isActive("italic")}
        >
          <Italic className="size-4" />
        </ToolbarBtn>
        <ToolbarBtn
          title="Garis bawah (Ctrl+U)"
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          isActive={editor?.isActive("underline")}
        >
          <UnderlineIcon className="size-4" />
        </ToolbarBtn>

        <Divider />

        <ToolbarBtn
          title="Judul 1"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor?.isActive("heading", { level: 1 })}
        >
          <Heading1 className="size-4" />
        </ToolbarBtn>
        <ToolbarBtn
          title="Judul 2"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor?.isActive("heading", { level: 2 })}
        >
          <Heading2 className="size-4" />
        </ToolbarBtn>

        <Divider />

        <ToolbarBtn
          title="Daftar butir"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          isActive={editor?.isActive("bulletList")}
        >
          <List className="size-4" />
        </ToolbarBtn>
        <ToolbarBtn
          title="Daftar bernomor"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          isActive={editor?.isActive("orderedList")}
        >
          <ListOrdered className="size-4" />
        </ToolbarBtn>
        <ToolbarBtn
          title="Kutipan"
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          isActive={editor?.isActive("blockquote")}
        >
          <Quote className="size-4" />
        </ToolbarBtn>

        <Divider />

        <ToolbarBtn
          title="Tambah tautan"
          onClick={handleAddLink}
          isActive={editor?.isActive("link")}
        >
          <Link2 className="size-4" />
        </ToolbarBtn>
        <ToolbarBtn
          title="Hapus tautan"
          onClick={() => editor?.chain().focus().unsetLink().run()}
          disabled={!editor?.isActive("link")}
        >
          <Link2Off className="size-4" />
        </ToolbarBtn>
      </div>

      {/* Editor area — clicking anywhere focuses it */}
      <div
        className="cursor-text p-4"
        onClick={() => editor?.commands.focus()}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
