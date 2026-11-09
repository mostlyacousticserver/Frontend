"use client";

import { HelpCircle, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export type DraftFaq = {
  id: string;
  question: string;
  answer: string;
};

export function newDraftFaq(): DraftFaq {
  return {
    id: `draft-${crypto.randomUUID()}`,
    question: "",
    answer: "",
  };
}

export function toCreateFaqPayload(faqs: DraftFaq[]) {
  return faqs
    .map((faq) => ({
      question: faq.question.trim(),
      answer: faq.answer.trim(),
    }))
    .filter((faq) => faq.question && faq.answer);
}

type DraftFaqsEditorProps = {
  faqs: DraftFaq[];
  disabled?: boolean;
  onChange: (faqs: DraftFaq[]) => void;
  description?: string;
};

export function DraftFaqsEditor({
  faqs,
  disabled,
  onChange,
  description = "Optional. These are saved on first create. You can edit them after saving.",
}: DraftFaqsEditorProps) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <HelpCircle className="size-4 text-brand-teal" />
        <h3 className="text-sm font-semibold text-brand-navy">FAQs</h3>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>

      <div className="mt-4 space-y-3">
        {faqs.length === 0 ? (
          <p className="rounded-lg border border-dashed border-zinc-200 px-3 py-4 text-sm text-muted-foreground">
            No FAQs yet. Add questions before publishing if you want.
          </p>
        ) : (
          faqs.map((faq, index) => (
            <div
              key={faq.id}
              className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-medium tracking-wide text-zinc-400 uppercase">
                  FAQ {index + 1}
                </span>
                <button
                  type="button"
                  disabled={disabled}
                  aria-label="Remove FAQ"
                  className="rounded-md p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                  onClick={() =>
                    onChange(faqs.filter((item) => item.id !== faq.id))
                  }
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
              <Input
                className="mt-2"
                placeholder="Question"
                value={faq.question}
                disabled={disabled}
                onChange={(event) =>
                  onChange(
                    faqs.map((item) =>
                      item.id === faq.id
                        ? { ...item, question: event.target.value }
                        : item,
                    ),
                  )
                }
              />
              <Textarea
                className="mt-2 min-h-20"
                placeholder="Answer"
                value={faq.answer}
                disabled={disabled}
                onChange={(event) =>
                  onChange(
                    faqs.map((item) =>
                      item.id === faq.id
                        ? { ...item, answer: event.target.value }
                        : item,
                    ),
                  )
                }
              />
            </div>
          ))
        )}
      </div>

      <Button
        type="button"
        className="mt-3"
        disabled={disabled}
        onClick={() => onChange([...faqs, newDraftFaq()])}
      >
        <Plus className="size-4" />
        Add FAQ
      </Button>
    </div>
  );
}
