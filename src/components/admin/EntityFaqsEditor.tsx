"use client";

import { useCallback, useEffect, useState } from "react";
import { HelpCircle, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { ContentFaqAPI } from "@/api/content-faqs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import type { ContentFaq, ContentFaqOwnerType } from "@/types/content-faq";

type EntityFaqsEditorProps = {
  ownerType: ContentFaqOwnerType;
  ownerId: string;
  className?: string;
};

export function EntityFaqsEditor({
  ownerType,
  ownerId,
  className,
}: EntityFaqsEditorProps) {
  const [faqs, setFaqs] = useState<ContentFaq[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const reload = useCallback(async () => {
    const response = await ContentFaqAPI.listAdmin({ ownerType, ownerId });
    setFaqs(response.data);
  }, [ownerType, ownerId]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    ContentFaqAPI.listAdmin({ ownerType, ownerId })
      .then((response) => {
        if (!cancelled) setFaqs(response.data);
      })
      .catch(() => {
        // API error toast handled by axios interceptor
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [ownerType, ownerId]);

  async function addFaq() {
    const q = question.trim();
    const a = answer.trim();
    if (!q || !a) {
      toast.error("Question and answer are required.");
      return;
    }
    setSaving(true);
    try {
      await ContentFaqAPI.create({
        ownerType,
        ownerId,
        question: q,
        answer: a,
      });
      setQuestion("");
      setAnswer("");
      toast.success("FAQ added");
      await reload();
    } catch {
      // API error toast handled by axios interceptor
    } finally {
      setSaving(false);
    }
  }

  async function patchFaq(
    id: string,
    payload: Pick<
      Partial<ContentFaq>,
      "question" | "answer" | "position" | "isActive"
    >,
  ) {
    const body: {
      question?: string;
      answer?: string;
      position?: number;
      isActive?: boolean;
    } = {};
    if (typeof payload.question === "string") body.question = payload.question;
    if (typeof payload.answer === "string") body.answer = payload.answer;
    if (typeof payload.position === "number") body.position = payload.position;
    if (typeof payload.isActive === "boolean") body.isActive = payload.isActive;
    if (Object.keys(body).length === 0) return;

    setSaving(true);
    try {
      await ContentFaqAPI.update(id, body);
      await reload();
    } catch {
      // API error toast handled by axios interceptor
    } finally {
      setSaving(false);
    }
  }

  async function removeFaq(id: string) {
    setSaving(true);
    try {
      await ContentFaqAPI.remove(id);
      toast.success("FAQ deleted");
      await reload();
    } catch {
      // API error toast handled by axios interceptor
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className={className}>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-3 h-28 w-full" />
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <HelpCircle className="size-4 text-brand-teal" />
        <h3 className="text-sm font-semibold text-brand-navy">FAQs</h3>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Shown on the public page for this item. Inactive entries stay hidden.
      </p>

      <div className="mt-4 space-y-3">
        {faqs.length === 0 ? (
          <p className="rounded-lg border border-dashed border-zinc-200 px-3 py-4 text-sm text-muted-foreground">
            No FAQs yet. Add the first question below.
          </p>
        ) : (
          faqs.map((faq, index) => (
            <div
              key={faq.id}
              className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-[11px] font-medium tracking-wide text-zinc-400 uppercase">
                  FAQ {index + 1}
                </span>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-[12px] text-zinc-600">
                    <Checkbox
                      checked={faq.isActive}
                      disabled={saving}
                      onCheckedChange={(checked) =>
                        void patchFaq(faq.id, { isActive: checked === true })
                      }
                    />
                    Active
                  </label>
                  <button
                    type="button"
                    disabled={saving}
                    aria-label="Delete FAQ"
                    className="rounded-md p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                    onClick={() => void removeFaq(faq.id)}
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
              <Input
                className="mt-2"
                defaultValue={faq.question}
                disabled={saving}
                onBlur={(event) => {
                  const next = event.target.value.trim();
                  if (next && next !== faq.question) {
                    void patchFaq(faq.id, { question: next });
                  }
                }}
              />
              <Textarea
                className="mt-2 min-h-20"
                defaultValue={faq.answer}
                disabled={saving}
                onBlur={(event) => {
                  const next = event.target.value.trim();
                  if (next && next !== faq.answer) {
                    void patchFaq(faq.id, { answer: next });
                  }
                }}
              />
            </div>
          ))
        )}
      </div>

      <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
        <p className="text-[11px] font-semibold tracking-wide text-zinc-400 uppercase">
          Add FAQ
        </p>
        <Input
          className="mt-2 bg-white"
          placeholder="Question"
          value={question}
          disabled={saving}
          onChange={(event) => setQuestion(event.target.value)}
        />
        <Textarea
          className="mt-2 min-h-20 bg-white"
          placeholder="Answer"
          value={answer}
          disabled={saving}
          onChange={(event) => setAnswer(event.target.value)}
        />
        <Button
          type="button"
          className="mt-3"
          disabled={saving}
          onClick={() => void addFaq()}
        >
          <Plus className="size-4" />
          Add FAQ
        </Button>
      </div>
    </div>
  );
}
