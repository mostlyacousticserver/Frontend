"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { SongAPI } from "@/api/songs";
import { ChordDiagram } from "@/components/songs/ChordDiagram";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { ChordCatalogEntry } from "@/types/song";
import { cn } from "@/lib/utils";

export function InsertChordDialog({
  open,
  onOpenChange,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (name: string, fingering?: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<ChordCatalogEntry[]>([]);
  const [custom, setCustom] = useState("");
  const [selected, setSelected] = useState<ChordCatalogEntry | null>(null);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setCustom("");
    setSelected(null);
    let cancelled = false;
    SongAPI.searchChords()
      .then((response) => {
        if (!cancelled) setItems(response.data.items);
      })
      .catch(() => {
        // toast handled by axios
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => item.name.toLowerCase().includes(q));
  }, [items, query]);

  const useName = custom.trim() || selected?.name || query.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-hidden sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-[20px]">Insert chord</DialogTitle>
          <DialogDescription>
            Pick a common voicing or type a custom chord name.
          </DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search e.g. Am, Cmaj7, F#7..."
            className="h-10 rounded-lg pl-9"
          />
        </div>
        <div className="grid max-h-[340px] grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-4">
          {filtered.map((item) => {
            const active = selected?.name === item.name;
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => {
                  setSelected(item);
                  setCustom("");
                }}
                className={cn(
                  "rounded-lg border p-2 text-left transition-colors",
                  active
                    ? "border-brand-orange bg-orange-50"
                    : "border-zinc-200 hover:bg-zinc-50",
                )}
              >
                <span className="mb-1 block text-[12px] font-semibold text-zinc-800">
                  {item.name}
                </span>
                <ChordDiagram fingering={item.fingering} className="mx-auto" />
              </button>
            );
          })}
        </div>
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-zinc-600">Custom chord</p>
          <Input
            value={custom}
            onChange={(event) => {
              setCustom(event.target.value);
              setSelected(null);
            }}
            placeholder="e.g. Cadd9/F#"
            className="rounded-lg"
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-brand-orange hover:bg-brand-orange-hover"
            disabled={!useName}
            onClick={() => {
              if (!useName) return;
              onSelect(useName, selected?.fingering);
              onOpenChange(false);
            }}
          >
            Use &quot;{useName || "?"}&quot;
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
