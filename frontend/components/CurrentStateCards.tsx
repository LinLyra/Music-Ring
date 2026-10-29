import StatusPill from "@/components/StatusPill";
import {
  formatTime,
  resolveInstrumentName,
  resolveNoteLabel,
  resolveTechniqueName,
} from "@/lib/format";
import { EMPTY_PLACEHOLDER } from "@/constants/enums";
import type { AppConfig, CurrentState } from "@/types/domain";
import type { Selection } from "@/lib/useDashboardData";

/** 单个信息块 */
function InfoCard({
  label,
  children,
  primary = false,
}: {
  label: string;
  children: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <span className="text-sm font-medium uppercase tracking-wide text-muted">
        {label}
      </span>
      <div
        className={`mt-3 font-semibold leading-tight text-foreground ${
          primary ? "text-4xl sm:text-5xl" : "text-2xl sm:text-3xl"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export default function CurrentStateCards({
  state,
  config,
  selection,
}: {
  state: CurrentState | null;
  config: AppConfig | null;
  selection: Selection;
}) {
  const selInstrument = selection.instrument
    ? config?.instruments.find((i) => i.code === selection.instrument)
    : null;
  const instrument = selInstrument
    ? selInstrument.name
    : resolveInstrumentName(state?.instrument);
  const key = selection.key ?? state?.key ?? EMPTY_PLACEHOLDER;
  const technique = state?.technique
    ? resolveTechniqueName(state.technique, config)
    : resolveTechniqueName(null, config);
  const note = resolveNoteLabel(state?.note);
  const playbackStatus = state?.playback.status ?? "idle";
  const lastPlayedAt = formatTime(state?.playback.lastPlayedAt);

  return (
    <section aria-label="Current performance" className="flex flex-col gap-4">
      {/* 主Status：乐器 / 音调 / 技法 — 大字号，便于远距离查看 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <InfoCard label="Instrument" primary>
          {instrument}
        </InfoCard>
        <InfoCard label="Key" primary>
          <span className="font-mono">{key}</span>
        </InfoCard>
        <InfoCard label="Technique" primary>
          {technique}
        </InfoCard>
      </div>

      {/*级Status：音符 / 播放Status / 最近播放时间 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <InfoCard label="Latest note">
          <span className="font-mono">{note}</span>
        </InfoCard>
        <InfoCard label="Playback">
          <StatusPill status={playbackStatus} size="lg" />
        </InfoCard>
        <InfoCard label="Last played">
          <span className="font-mono">{lastPlayedAt}</span>
        </InfoCard>
      </div>
    </section>
  );
}
