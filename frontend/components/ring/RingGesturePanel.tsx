"use client";

import { useState } from "react";

import Button from "@/components/Button";
import EmptyState from "@/components/EmptyState";
import Input from "@/components/Input";
import { RING_DEFAULT_REPS } from "@/constants/enums";
import type { GestureTemplateInfo, RingStatus } from "@/types/ring";

export default function RingGesturePanel({
  gestures,
  gestureMethod,
  status,
  busy,
  onDelete,
  onBeginRecording,
  onRepStart,
  onRepStop,
  onRepCancel,
}: {
  gestures: GestureTemplateInfo[];
  gestureMethod: "dtw" | "hmm";
  status: RingStatus | null;
  busy: boolean;
  onDelete: (name: string) => void;
  onBeginRecording: (name: string, reps: number) => void;
  onRepStart: () => void;
  onRepStop: () => void;
  onRepCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [reps, setReps] = useState(RING_DEFAULT_REPS);

  const connected = status?.connection === "connected";
  const inGestureMode = status?.mode === "gesture";
  const recording = status?.recording ?? null;

  const canStart = connected && inGestureMode && !recording && name.trim().length > 0;

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <header className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-foreground">
          {gestureMethod === "hmm" ? "HMM gesture models" : "Gestures"}
        </h2>
        <span className="text-sm text-muted">{gestures.length} total</span>
      </header>

      {/* 已Save手势列表 */}
      {gestures.length > 0 ? (
        <ul className="divide-y divide-border rounded-xl border border-border">
          {gestures.map((g) => (
            <li
              key={g.name}
              className="flex items-center justify-between gap-3 px-4 py-3"
            >
              <span className="flex flex-col">
                <span className="text-sm font-medium text-foreground">{g.name}</span>
                <span className="font-mono text-xs text-muted">
                  {g.type === "hmm"
                    ? "Trained model"
                    : `${g.sampleCount ?? 0} samples · threshold ${(g.threshold ?? 0).toFixed(2)}`}
                </span>
              </span>
              {gestureMethod === "dtw" && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDelete(g.name)}
                  disabled={busy}
                >
                  Delete
                </Button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title={gestureMethod === "hmm" ? "No trained models" : "No custom gestures"}
          description={
            gestureMethod === "hmm"
              ? "Place .pkl model files in vendor/models/ to recognize gestures."
              : "Connect the ring and switch to gesture mode to record the first gesture."
          }
        />
      )}

      {/* 录制区（仅 DTW 模式） */}
      {gestureMethod === "dtw" && (
      <div className="rounded-xl border border-border bg-surface-muted p-4">
        {recording ? (
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-sm font-medium text-foreground">
                Recording "{recording.name}"
              </span>
              <span className="font-mono text-sm text-muted">
                Rep {Math.min(recording.currentRep + 1, recording.targetReps)}/
                {recording.targetReps}
              </span>
            </div>
            {recording.message && (
              <p className="text-sm text-warn">{recording.message}</p>
            )}
            <p className="text-sm text-muted">
              {recording.active
                ? "Recording this repetition. Choose Finish rep when you are done."
                : "Choose Start rep, then perform the gesture once."}
            </p>
            <div className="flex flex-wrap gap-2">
              {recording.active ? (
                <Button onClick={onRepStop} disabled={busy}>
                  Finish rep
                </Button>
              ) : (
                <Button onClick={onRepStart} disabled={busy}>
                  Start rep
                </Button>
              )}
              <Button variant="ghost" onClick={onRepCancel} disabled={busy}>
                Cancel recording
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
              <Input
                label="Gesture name"
                placeholder="For example: circle"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                label="Repetitions"
                type="number"
                min={2}
                max={20}
                value={reps}
                onChange={(e) =>
                  setReps(
                    Math.max(2, Math.min(20, Number(e.target.value) || RING_DEFAULT_REPS)),
                  )
                }
                className="sm:w-28"
              />
            </div>
            <div>
              <Button
                onClick={() => onBeginRecording(name.trim(), reps)}
                disabled={!canStart || busy}
              >
                Start recording
              </Button>
            </div>
            {!connected ? (
              <p className="text-sm text-muted">Connect the ring before recording a gesture.</p>
            ) : !inGestureMode ? (
              <p className="text-sm text-warn">
                The ring is not in gesture mode. Press its button once, then record.
              </p>
            ) : null}
          </div>
        )}
      </div>
      )}
    </section>
  );
}
