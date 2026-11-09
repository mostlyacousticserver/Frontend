"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Eye,
  Maximize2,
  Save,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import { BlogAPI } from "@/api/blogs";
import { BlogBlockEditor } from "@/components/admin/BlogBlockEditor";
import { BlogCoverField } from "@/components/admin/BlogCoverField";
import {
  DraftFaqsEditor,
  toCreateFaqPayload,
  type DraftFaq,
} from "@/components/admin/DraftFaqsEditor";
import { EntityFaqsEditor } from "@/components/admin/EntityFaqsEditor";
import { BlogBlocks } from "@/components/blog/BlogBlocks";
import { BlogMedia } from "@/components/blog/BlogMedia";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  incompleteImageCount,
  normalizeBlogContent,
  toApiContent,
  withBlockIds,
} from "@/lib/blog-content";
import { cn } from "@/lib/utils";
import type { BlogDetail, EditorBlogBlock } from "@/types/blog";

type EditorState = {
  title: string;
  coverImageUrl: string;
  metaTitle: string;
  metaDescription: string;
  isPublished: boolean;
  blocks: EditorBlogBlock[];
};

function fromBlog(blog?: BlogDetail): EditorState {
  const content = normalizeBlogContent(blog?.content);
  return {
    title: blog?.title ?? "",
    coverImageUrl: blog?.coverImageUrl ?? "",
    metaTitle: blog?.metaTitle ?? "",
    metaDescription: blog?.metaDescription ?? "",
    isPublished: blog?.isPublished ?? false,
    blocks: withBlockIds(content),
  };
}

export function BlogEditor({ blog }: { blog?: BlogDetail }) {
  const router = useRouter();
  const [state, setState] = useState<EditorState>(() => fromBlog(blog));
  const [focus, setFocus] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [blogId, setBlogId] = useState(blog?.id);
  const [slug, setSlug] = useState(blog?.slug);
  const [draftFaqs, setDraftFaqs] = useState<DraftFaq[]>([]);

  useEffect(() => {
    if (blog) {
      setState(fromBlog(blog));
      setBlogId(blog.id);
      setSlug(blog.slug);
    }
  }, [blog]);

  const previewContent = useMemo(
    () => toApiContent(state.blocks),
    [state.blocks],
  );

  function patch(partial: Partial<EditorState>) {
    setState((current) => ({ ...current, ...partial }));
  }

  async function save(publish?: boolean) {
    if (!state.title.trim()) {
      toast.error("Title is required.");
      return;
    }
    if (!state.coverImageUrl.trim()) {
      toast.error("Upload a cover image before saving.");
      return;
    }
    const emptyImages = incompleteImageCount(state.blocks);
    if (emptyImages > 0) {
      toast.error("Upload or remove empty image blocks.");
      return;
    }

    const isPublished =
      typeof publish === "boolean" ? publish : state.isPublished;
    setSaving(true);
    try {
      const payload = {
        title: state.title.trim(),
        coverImageUrl: state.coverImageUrl.trim(),
        content: toApiContent(state.blocks),
        metaTitle: state.metaTitle.trim() || undefined,
        metaDescription: state.metaDescription.trim() || undefined,
        isPublished,
      };
      if (!blogId) {
        const faqs = toCreateFaqPayload(draftFaqs);
        const created = await BlogAPI.create({
          ...payload,
          ...(faqs.length > 0 ? { faqs } : {}),
        });
        setBlogId(created.data.id);
        setSlug(created.data.slug);
        setState(fromBlog(created.data));
        setDraftFaqs([]);
        toast.success(isPublished ? "Blog published" : "Draft saved");
        router.replace(`/admin/blogs/${created.data.id}`);
        return;
      }
      const updated = await BlogAPI.update(blogId, payload);
      setSlug(updated.data.slug);
      setState(fromBlog(updated.data));
      toast.success(
        publish === true
          ? "Blog published"
          : publish === false
            ? "Blog unpublished"
            : "Blog saved",
      );
    } catch {
      // interceptor toast
    } finally {
      setSaving(false);
    }
  }

  async function confirmRemove() {
    if (!blogId) {
      router.push("/admin/blogs");
      return;
    }
    setDeleting(true);
    try {
      await BlogAPI.remove(blogId);
      toast.success("Blog deleted");
      router.push("/admin/blogs");
    } catch {
      // interceptor toast
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#f3f6f8] text-brand-navy">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-brand-navy px-4 py-2.5 text-white">
        <div className="flex min-w-0 items-center gap-2">
          <SidebarTrigger className="-ml-1 text-white/80 hover:bg-white/10 hover:text-white" />
          <Link
            href="/admin/blogs"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-white/70 hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Blogs
          </Link>
          <span className="truncate text-[15px] font-semibold text-white">
            {state.title.trim() || "New blog"}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
              state.isPublished
                ? "bg-teal-50 text-teal-700"
                : "bg-white/10 text-white/70",
            )}
          >
            {state.isPublished ? "Published" : "Draft"}
          </span>
          <GhostBtn onClick={() => setFocus((v) => !v)}>
            <Maximize2 className="size-3.5" />
            {focus ? "Exit focus" : "Focus"}
          </GhostBtn>
          <GhostBtn
            onClick={() => {
              if (slug && state.isPublished) {
                window.open(`/blog/${slug}`, "_blank");
                return;
              }
              toast.success("Live preview is the right pane.");
            }}
          >
            <Eye className="size-3.5" />
            Preview
          </GhostBtn>
          <GhostBtn disabled={saving} onClick={() => void save()}>
            <Save className="size-3.5" />
            Save
          </GhostBtn>
          {state.isPublished ? (
            <GhostBtn disabled={saving} onClick={() => void save(false)}>
              Unpublish
            </GhostBtn>
          ) : null}
          <button
            type="button"
            className="rounded-md p-2 text-white/60 hover:bg-white/10 hover:text-white"
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2 className="size-4" />
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => void save(true)}
            className="rounded-lg bg-brand-orange px-4 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-brand-orange-hover disabled:opacity-60"
          >
            Publish
          </button>
        </div>
      </div>

      <div
        className={cn(
          "grid min-h-0 flex-1 grid-cols-1",
          !focus && "xl:grid-cols-2",
        )}
      >
        <div className="min-h-0 overflow-y-auto border-zinc-200 px-6 py-5 xl:border-r">
          <div className="mx-auto max-w-[640px] space-y-5">
            {!focus ? (
              <>
                <BlogCoverField
                  value={state.coverImageUrl}
                  disabled={saving}
                  onChange={(coverImageUrl) => patch({ coverImageUrl })}
                />
                <input
                  value={state.title}
                  onChange={(event) => patch({ title: event.target.value })}
                  placeholder="Blog title"
                  className="w-full border-0 bg-transparent p-0 text-[32px] font-bold leading-tight tracking-tight text-zinc-900 outline-none placeholder:text-zinc-300"
                />
                <textarea
                  value={state.metaDescription}
                  onChange={(event) =>
                    patch({ metaDescription: event.target.value })
                  }
                  placeholder="Short excerpt for cards and SEO"
                  rows={2}
                  className="w-full resize-none border-0 bg-transparent p-0 text-[15px] leading-7 text-zinc-500 outline-none placeholder:text-zinc-300"
                />
                <label className="block">
                  <span className="mb-1 block text-[11px] font-medium tracking-wide text-zinc-400 uppercase">
                    SEO title
                  </span>
                  <input
                    value={state.metaTitle}
                    onChange={(event) =>
                      patch({ metaTitle: event.target.value })
                    }
                    placeholder={state.title.trim() || "Optional override"}
                    className="h-9 w-full rounded-md border border-zinc-200 bg-white px-3 text-[13px] outline-none focus:border-brand-orange"
                  />
                </label>
                <div className="border-t border-zinc-100 pt-2" />
              </>
            ) : null}

            <BlogBlockEditor
              blocks={state.blocks}
              onChange={(blocks) => patch({ blocks })}
            />

            {!focus ? (
              <div className="border-t border-zinc-100 pt-5">
                {blogId ? (
                  <EntityFaqsEditor ownerType="blog" ownerId={blogId} />
                ) : (
                  <DraftFaqsEditor
                    faqs={draftFaqs}
                    disabled={saving}
                    onChange={setDraftFaqs}
                    description="Optional. These are saved with the blog on first create. You can edit them after saving."
                  />
                )}
              </div>
            ) : null}
          </div>
        </div>

        {focus ? null : (
          <div className="min-h-0 overflow-y-auto bg-[#F4F6F8] px-6 py-5">
            <div className="mx-auto max-w-[560px]">
              <div className="mb-4 flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] text-zinc-400 uppercase">
                <Eye className="size-3.5" />
                Live preview
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-white px-6 py-6 shadow-[0_10px_32px_rgba(15,23,42,0.04)]">
                {state.coverImageUrl.trim() ? (
                  <div className="mb-5 overflow-hidden rounded-xl bg-zinc-100">
                    <div className="aspect-16/9">
                      <BlogMedia stored={state.coverImageUrl} alt="" />
                    </div>
                  </div>
                ) : null}
                <p className="text-[11px] font-semibold tracking-wide text-zinc-400 uppercase">
                  Article
                </p>
                <h2 className="mt-2 text-[22px] font-bold leading-snug text-zinc-900">
                  {state.title.trim() || "Untitled"}
                </h2>
                {state.metaDescription.trim() ? (
                  <p className="mt-2 text-[14px] leading-6 text-zinc-500">
                    {state.metaDescription}
                  </p>
                ) : null}
                <div className="mt-5">
                  <BlogBlocks content={previewContent} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this blog?</AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone. The post will be removed from the public
              site if it was published.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              onClick={() => void confirmRemove()}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function GhostBtn({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium text-white/75 hover:bg-white/10 hover:text-white disabled:opacity-50"
    >
      {children}
    </button>
  );
}
