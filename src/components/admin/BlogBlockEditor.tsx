"use client";

import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Code2,
  Heading,
  ImageIcon,
  List,
  Minus,
  Plus,
  Quote,
  Trash2,
  Type,
} from "lucide-react";
import { BlogCoverField } from "@/components/admin/BlogCoverField";
import { createEditorBlock, flattenInline, setInlineText } from "@/lib/blog-content";
import { cn } from "@/lib/utils";
import type {
  BlogBlockKind,
  EditorBlogBlock,
} from "@/types/blog";

const ADD_KINDS: { kind: BlogBlockKind; label: string; icon: typeof Type }[] = [
  { kind: "paragraph", label: "Paragraph", icon: Type },
  { kind: "heading", label: "Heading", icon: Heading },
  { kind: "image", label: "Image", icon: ImageIcon },
  { kind: "list", label: "List", icon: List },
  { kind: "quote", label: "Quote", icon: Quote },
  { kind: "code", label: "Code", icon: Code2 },
  { kind: "divider", label: "Divider", icon: Minus },
];

export function BlogBlockEditor({
  blocks,
  onChange,
  mediaFolder = "blog",
}: {
  blocks: EditorBlogBlock[];
  onChange: (blocks: EditorBlogBlock[]) => void;
  mediaFolder?: "blog" | "free-courses" | "site";
}) {
  const [menuAt, setMenuAt] = useState<number | "bottom" | null>(null);

  function updateAt(index: number, next: EditorBlogBlock) {
    const copy = [...blocks];
    copy[index] = next;
    onChange(copy);
  }

  function insertAt(index: number, created: EditorBlogBlock) {
    const copy = [...blocks];
    copy.splice(index, 0, created);
    onChange(copy);
    setMenuAt(null);
  }

  function removeAt(index: number) {
    onChange(blocks.filter((_, i) => i !== index));
  }

  function moveAt(index: number, dir: -1 | 1) {
    const next = index + dir;
    if (next < 0 || next >= blocks.length) return;
    const copy = [...blocks];
    const [item] = copy.splice(index, 1);
    copy.splice(next, 0, item);
    onChange(copy);
  }

  return (
    <div className="space-y-3">
      {blocks.length === 0 ? (
        <p className="py-8 text-center text-[13px] text-zinc-400">
          Add a paragraph to start writing.
        </p>
      ) : null}

      {blocks.map((block, index) => (
        <div key={block.id} className="group/block relative">
          <div className="flex items-start gap-2">
            <div className="flex shrink-0 flex-col gap-0.5 pt-1 opacity-0 transition-opacity group-hover/block:opacity-100 focus-within:opacity-100">
              <button
                type="button"
                disabled={index === 0}
                className="flex size-6 items-center justify-center rounded text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 disabled:opacity-30"
                onClick={() => moveAt(index, -1)}
                aria-label="Move block up"
              >
                <ArrowUp className="size-3.5" />
              </button>
              <button
                type="button"
                disabled={index === blocks.length - 1}
                className="flex size-6 items-center justify-center rounded text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 disabled:opacity-30"
                onClick={() => moveAt(index, 1)}
                aria-label="Move block down"
              >
                <ArrowDown className="size-3.5" />
              </button>
              <button
                type="button"
                className="flex size-6 items-center justify-center rounded text-zinc-400 hover:bg-red-50 hover:text-red-600"
                onClick={() => removeAt(index)}
                aria-label="Delete block"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
            <div className="min-w-0 flex-1">
              <BlockFields
                block={block}
                mediaFolder={mediaFolder}
                onChange={(next) => updateAt(index, next)}
              />
            </div>
          </div>
          <div className="mt-2 ml-8">
            {menuAt === index ? (
              <AddBlockMenu
                onPick={(kind) => insertAt(index + 1, createEditorBlock(kind))}
                onClose={() => setMenuAt(null)}
              />
            ) : (
              <button
                type="button"
                className="text-[12px] font-medium text-zinc-400 opacity-0 hover:text-brand-orange group-hover/block:opacity-100"
                onClick={() => setMenuAt(index)}
              >
                + Add below
              </button>
            )}
          </div>
        </div>
      ))}

      <div className="flex justify-center pt-2">
        {menuAt === "bottom" ? (
          <AddBlockMenu
            onPick={(kind) => insertAt(blocks.length, createEditorBlock(kind))}
            onClose={() => setMenuAt(null)}
          />
        ) : (
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-zinc-300 px-5 py-2 text-[13px] font-medium text-zinc-500 hover:border-brand-orange hover:text-brand-orange"
            onClick={() => setMenuAt("bottom")}
          >
            <Plus className="size-4" />
            Add block
          </button>
        )}
      </div>
    </div>
  );
}

function AddBlockMenu({
  onPick,
  onClose,
}: {
  onPick: (kind: BlogBlockKind) => void;
  onClose: () => void;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-2 shadow-sm">
      <div className="grid grid-cols-2 gap-1 sm:grid-cols-4">
        {ADD_KINDS.map((item) => (
          <button
            key={item.kind}
            type="button"
            className="inline-flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[13px] text-zinc-700 hover:bg-zinc-50"
            onClick={() => onPick(item.kind)}
          >
            <item.icon className="size-3.5 text-zinc-400" />
            {item.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="mt-1 w-full rounded-md px-2 py-1 text-[12px] text-zinc-400 hover:text-zinc-600"
        onClick={onClose}
      >
        Cancel
      </button>
    </div>
  );
}

function BlockFields({
  block,
  onChange,
  mediaFolder = "blog",
}: {
  block: EditorBlogBlock;
  onChange: (next: EditorBlogBlock) => void;
  mediaFolder?: "blog" | "free-courses" | "site";
}) {
  if (block.type === "heading") {
    return (
      <div className="flex gap-2 py-1">
        <select
          value={String(block.level)}
          onChange={(event) =>
            onChange({
              ...block,
              level: Number(event.target.value) as 1 | 2 | 3,
            })
          }
          className="h-9 rounded-md border border-zinc-200 px-2 text-[13px]"
        >
          <option value="1">H1</option>
          <option value="2">H2</option>
          <option value="3">H3</option>
        </select>
        <input
          value={flattenInline(block.children)}
          onChange={(event) =>
            onChange(setInlineText(block, event.target.value))
          }
          placeholder="Heading"
          className={cn(
            "h-9 flex-1 border-0 bg-transparent font-semibold outline-none",
            block.level === 1 ? "text-[22px]" : "text-[18px]",
          )}
        />
      </div>
    );
  }

  if (block.type === "paragraph") {
    return (
      <textarea
        value={flattenInline(block.children)}
        rows={3}
        placeholder="Write a paragraph…"
        className="w-full resize-none border-0 bg-transparent py-1 text-[15px] leading-7 text-zinc-600 outline-none"
        onChange={(event) => onChange(setInlineText(block, event.target.value))}
      />
    );
  }

  if (block.type === "image") {
    return (
      <div className="space-y-2 rounded-xl border border-zinc-200 bg-white p-3">
        <BlogCoverField
          compact
          folder={mediaFolder}
          value={block.url}
          onChange={(url) => onChange({ ...block, url })}
        />
        <input
          value={block.alt ?? ""}
          placeholder="Alt text"
          className="h-8 w-full rounded-md border border-zinc-200 px-2 text-[13px] outline-none focus:border-brand-orange"
          onChange={(event) => onChange({ ...block, alt: event.target.value })}
        />
        <input
          value={block.caption ?? ""}
          placeholder="Caption (optional)"
          className="h-8 w-full border-0 bg-transparent text-[12px] text-zinc-500 outline-none"
          onChange={(event) =>
            onChange({ ...block, caption: event.target.value })
          }
        />
      </div>
    );
  }

  if (block.type === "list") {
    return (
      <div className="space-y-2 rounded-xl border border-zinc-100 bg-zinc-50/60 p-3">
        <select
          value={block.style}
          onChange={(event) =>
            onChange({
              ...block,
              style: event.target.value as "unordered" | "ordered",
            })
          }
          className="h-8 rounded-md border border-zinc-200 bg-white px-2 text-[12px]"
        >
          <option value="unordered">Bulleted list</option>
          <option value="ordered">Numbered list</option>
        </select>
        <div className="space-y-1.5">
          {block.items.map((item, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className="mt-2 w-5 shrink-0 text-center text-[12px] text-zinc-400">
                {block.style === "ordered" ? `${index + 1}.` : "•"}
              </span>
              <textarea
                value={flattenInline(item.children)}
                rows={1}
                placeholder="List item"
                className="min-h-8 flex-1 resize-none rounded-md border border-zinc-200 bg-white px-2 py-1.5 text-[14px] outline-none focus:border-brand-orange"
                onChange={(event) => {
                  const items = [...block.items];
                  items[index] = { children: [{ text: event.target.value }] };
                  onChange({ ...block, items });
                }}
              />
              <button
                type="button"
                className="mt-1 text-zinc-400 hover:text-red-600"
                onClick={() => {
                  const items =
                    block.items.length === 1
                      ? [{ children: [{ text: "" }] }]
                      : block.items.filter((_, i) => i !== index);
                  onChange({ ...block, items });
                }}
                aria-label="Remove item"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="text-[12px] font-medium text-brand-orange"
          onClick={() =>
            onChange({
              ...block,
              items: [...block.items, { children: [{ text: "" }] }],
            })
          }
        >
          + Add item
        </button>
      </div>
    );
  }

  if (block.type === "quote") {
    return (
      <div className="rounded-r-xl border-l-4 border-[#11C5BB] bg-[#EFFCF9] px-4 py-3">
        <textarea
          value={flattenInline(block.children)}
          rows={2}
          placeholder="Pull quote"
          className="w-full resize-none border-0 bg-transparent font-serif text-[16px] italic leading-7 text-[#27405A] outline-none"
          onChange={(event) =>
            onChange(setInlineText(block, event.target.value))
          }
        />
        <input
          value={block.cite ?? ""}
          placeholder="Citation (optional)"
          className="mt-2 h-8 w-full border-0 bg-transparent text-[12px] font-semibold text-[#0DA694] outline-none"
          onChange={(event) => onChange({ ...block, cite: event.target.value })}
        />
      </div>
    );
  }

  if (block.type === "code") {
    return (
      <div className="rounded-xl border border-zinc-200 bg-zinc-950 px-4 py-3">
        <input
          value={block.language ?? ""}
          placeholder="Language (optional)"
          className="mb-2 h-7 w-full border-0 bg-transparent text-[11px] uppercase tracking-wide text-zinc-400 outline-none"
          onChange={(event) =>
            onChange({ ...block, language: event.target.value })
          }
        />
        <textarea
          value={block.code}
          rows={5}
          placeholder="Code"
          className="w-full resize-y border-0 bg-transparent font-mono text-[13px] leading-6 text-zinc-100 outline-none"
          onChange={(event) => onChange({ ...block, code: event.target.value })}
        />
      </div>
    );
  }

  return <hr className="my-4 border-zinc-200" />;
}
