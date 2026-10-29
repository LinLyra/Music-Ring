"use client";

import { useEffect, useMemo, useState } from "react";

import catalog from "@/constants/catalog.json";
import { playNote, updateSelection } from "@/lib/services";
import { ApiClientError } from "@/types/api";
import type { AppConfig, CatalogNote } from "@/types/domain";

const REGISTERS = [
  { id: "low", label: "Low" },
  { id: "normal", label: "Middle" },
  { id: "high", label: "High" },
] as const;

const FALLBACK_INSTRUMENTS = catalog.instruments;
const FALLBACK_KEYS = catalog.keys;
const FALLBACK_NOTES = catalog.notesByInstrument as Record<string, CatalogNote[]>;

export default function InstrumentBoard({
  config,
  instrument,
  noteKey,
  activeNote,
}: {
  config: AppConfig | null;
  instrument: string | null;
  noteKey: string | null;
  activeNote: string | null;
}) {
  const instruments = config?.instruments?.length ? config.instruments : FALLBACK_INSTRUMENTS;
  const keys = config?.keys?.length ? config.keys : FALLBACK_KEYS;
  const notesByInstrument = config?.notesByInstrument ?? FALLBACK_NOTES;

  const [selectedInstrument, setSelectedInstrument] = useState(instrument || "pipa");
  const [selectedKey, setSelectedKey] = useState(noteKey || "D");
  const [pending, setPending] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (instrument) setSelectedInstrument(instrument);
  }, [instrument]);

  useEffect(() => {
    if (noteKey) setSelectedKey(noteKey);
  }, [noteKey]);

  const notes = notesByInstrument[selectedInstrument] ?? [];
  const grouped = useMemo(
    () =>
      REGISTERS.map((register) => ({
        ...register,
        notes: notes.filter((note) => (note.register ?? "normal") === register.id),
      })).filter((group) => group.notes.length > 0),
    [notes],
  );

  const chooseInstrument = (code: string) => {
    setSelectedInstrument(code);
    setMessage(null);
    void updateSelection({ instrument: code, key: selectedKey }).catch(() => {});
  };

  const chooseKey = (key: string) => {
    setSelectedKey(key);
    setMessage(null);
    void updateSelection({ instrument: selectedInstrument, key }).catch(() => {});
  };

  const play = async (code: string) => {
    setPending(code);
    setMessage(null);
    try {
      await playNote({ instrument: selectedInstrument, key: selectedKey, note: code });
    } catch (err) {
      if (err instanceof ApiClientError) {
        setMessage(err.message);
      } else {
        setMessage("Sound needs the local backend on this computer. This public page is the visual demo.");
      }
    } finally {
      setPending(null);
    }
  };

  return (
    <section aria-label="Instruments and notes" className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Instruments</h2>
          <p className="mt-1 text-sm text-muted">
            Pick an instrument and a note. Real sound needs the local backend. A ring is optional.
          </p>
        </div>
        <span className="font-mono text-sm text-muted">{selectedKey}</span>
      </header>

      <div className="flex flex-wrap gap-2">
        {instruments.filter((item) => item.enabled !== false).map((item) => {
          const active = item.code === selectedInstrument;
          return (
            <button
              key={item.code}
              type="button"
              onClick={() => chooseInstrument(item.code)}
              className={[
                "rounded-lg border px-3 py-1.5 text-sm transition",
                active
                  ? "border-foreground bg-foreground text-surface"
                  : "border-border bg-surface text-foreground hover:bg-surface-muted",
              ].join(" ")}
            >
              {item.name}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {keys.map((key) => {
          const active = key === selectedKey;
          return (
            <button
              key={key}
              type="button"
              onClick={() => chooseKey(key)}
              className={[
                "min-w-9 rounded-md border px-2 py-1 font-mono text-xs transition",
                active
                  ? "border-info bg-info-soft text-info"
                  : "border-border bg-surface-muted text-muted hover:text-foreground",
              ].join(" ")}
            >
              {key}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-4">
        {grouped.map((group) => (
          <div key={group.id} className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-muted">{group.label}</span>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
              {group.notes.map((note) => {
                const active = activeNote === note.code;
                const busy = pending === note.code;
                return (
                  <button
                    key={note.code}
                    type="button"
                    onClick={() => void play(note.code)}
                    disabled={pending !== null}
                    className={[
                      "flex h-16 flex-col items-center justify-center rounded-xl border transition",
                      active
                        ? "border-foreground bg-foreground text-surface"
                        : "border-border bg-surface-muted text-foreground hover:border-foreground/30",
                      busy ? "opacity-60" : "",
                    ].join(" ")}
                  >
                    <span className="text-xl font-semibold leading-none">{note.degree}</span>
                    <span className={`mt-1 font-mono text-xs ${active ? "text-surface/80" : "text-muted"}`}>
                      {note.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {message && <p className="text-sm text-danger">{message}</p>}
    </section>
  );
}
