"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  ListOrdered,
  Maximize2,
  Redo2,
  Underline as UnderlineIcon,
  Undo2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ARTICLE_PROSE_CLASS,
  htmlToPlainText,
  isEmptyHtml,
  sanitizeLessonHtml,
} from "@/lib/lesson-html";
import { cn } from "@/lib/utils";

type LessonTextEditorProps = {
  value: string;
  disabled?: boolean;
  className?: string;
  onChange: (html: string) => void;
};

export function LessonTextEditor({
  value,
  disabled,
  className,
  onChange,
}: LessonTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    editable: !disabled,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
    ],
    content: value || "<p></p>",
    editorProps: {
      attributes: {
        class: cn("min-h-full px-4 py-3 outline-none", ARTICLE_PROSE_CLASS),
      },
    },
    onUpdate: ({ editor: instance }) => {
      onChange(sanitizeLessonHtml(instance.getHTML()));
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [disabled, editor]);

  useEffect(() => {
    if (!editor) return;
    const next = value?.trim() ? value : "<p></p>";
    if (editor.getHTML() === next) return;
    editor.commands.setContent(next, { emitUpdate: false });
  }, [editor, value]);

  function setLink() {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const href = window.prompt("Link URL", previous ?? "https://");
    if (href === null) return;
    const trimmed = href.trim();
    if (!trimmed) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: trimmed }).run();
  }

  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col overflow-hidden rounded-md border border-input bg-background",
        className,
      )}
    >
      <div className="flex shrink-0 flex-wrap gap-0.5 border-b border-border bg-muted/40 p-1">
        <ToolbarButton
          label="Bold"
          active={editor?.isActive("bold")}
          disabled={!editor || disabled}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <Bold />
        </ToolbarButton>
        <ToolbarButton
          label="Italic"
          active={editor?.isActive("italic")}
          disabled={!editor || disabled}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <Italic />
        </ToolbarButton>
        <ToolbarButton
          label="Underline"
          active={editor?.isActive("underline")}
          disabled={!editor || disabled}
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon />
        </ToolbarButton>
        <ToolbarButton
          label="Heading 2"
          active={editor?.isActive("heading", { level: 2 })}
          disabled={!editor || disabled}
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 />
        </ToolbarButton>
        <ToolbarButton
          label="Heading 3"
          active={editor?.isActive("heading", { level: 3 })}
          disabled={!editor || disabled}
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <Heading3 />
        </ToolbarButton>
        <ToolbarButton
          label="Bullet list"
          active={editor?.isActive("bulletList")}
          disabled={!editor || disabled}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          <List />
        </ToolbarButton>
        <ToolbarButton
          label="Numbered list"
          active={editor?.isActive("orderedList")}
          disabled={!editor || disabled}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered />
        </ToolbarButton>
        <ToolbarButton
          label="Link"
          active={editor?.isActive("link")}
          disabled={!editor || disabled}
          onClick={setLink}
        >
          <Link2 />
        </ToolbarButton>
        <ToolbarButton
          label="Undo"
          disabled={!editor || disabled || !editor.can().undo()}
          onClick={() => editor?.chain().focus().undo().run()}
        >
          <Undo2 />
        </ToolbarButton>
        <ToolbarButton
          label="Redo"
          disabled={!editor || disabled || !editor.can().redo()}
          onClick={() => editor?.chain().focus().redo().run()}
        >
          <Redo2 />
        </ToolbarButton>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

export function LessonArticleField({
  value,
  disabled,
  onChange,
}: {
  value: string;
  disabled?: boolean;
  onChange: (html: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const preview = htmlToPlainText(value);
  const empty = isEmptyHtml(value);

  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  function apply() {
    onChange(sanitizeLessonHtml(draft));
    setOpen(false);
  }

  return (
    <div className="space-y-2">
      <div className="rounded-md border bg-muted/30 px-3 py-2">
        {empty ? (
          <p className="text-sm text-muted-foreground">No article written yet.</p>
        ) : (
          <p className="line-clamp-4 text-sm text-foreground">{preview}</p>
        )}
      </div>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={disabled}
        onClick={() => setOpen(true)}
      >
        <Maximize2 />
        {empty ? "Write article" : "Edit article"}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex max-h-[90vh] w-[calc(100%-2rem)] max-w-4xl flex-col gap-4 overflow-hidden sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit article</DialogTitle>
            <DialogDescription>
              Format the lesson in this window. Choose Done to keep your
              changes, then save the lesson.
            </DialogDescription>
          </DialogHeader>
          <div className="h-[min(70vh,640px)] min-h-80">
            {open ? (
              <LessonTextEditor
                value={draft}
                disabled={disabled}
                onChange={setDraft}
              />
            ) : null}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" disabled={disabled} onClick={apply}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ToolbarButton({
  label,
  active,
  disabled,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <Button
      type="button"
      variant={active ? "secondary" : "ghost"}
      size="icon-sm"
      disabled={disabled}
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
