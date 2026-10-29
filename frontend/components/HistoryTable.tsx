import EmptyState from "@/components/EmptyState";
import StatusPill from "@/components/StatusPill";
import {
  formatTime,
  resolveInstrumentName,
  resolveNoteLabel,
  resolveTechniqueName,
} from "@/lib/format";
import type { AppConfig, HistoryItem } from "@/types/domain";

function WarningBadge({ warnings }: { warnings: string[] }) {
  if (!warnings || warnings.length === 0) return null;
  return (
    <span
      title={warnings.join("\n")}
      className="ml-2 inline-flex items-center gap-1 rounded-full border border-warn/30 bg-warn-soft px-2 py-0.5 text-xs font-medium text-warn"
    >
      Notes {warnings.length}
    </span>
  );
}

export default function HistoryTable({
  items,
  config,
}: {
  items: HistoryItem[];
  config: AppConfig | null;
}) {
  return (
    <section aria-label="History" className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold text-foreground">History</h2>
        <span className="text-sm text-muted">Latest {items.length}</span>
      </div>

      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-3 font-medium">Time</th>
                <th className="px-4 py-3 font-medium">Instrument</th>
                <th className="px-4 py-3 font-medium">Key</th>
                <th className="px-4 py-3 font-medium">Note</th>
                <th className="px-4 py-3 font-medium">Technique</th>
                <th className="px-4 py-3 font-medium">Result</th>
                <th className="px-4 py-3 font-medium">Event ID</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const failed = item.playback.status === "failed";
                return (
                  <tr
                    key={item.eventId}
                    className={`border-b border-border/60 last:border-0 ${
                      failed ? "bg-danger-soft/50" : "hover:bg-surface-muted"
                    }`}
                  >
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-muted">
                      {formatTime(item.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-foreground">
                      {resolveInstrumentName(item.instrument)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-foreground">
                      {item.key}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-foreground">
                      {resolveNoteLabel(item.note)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-foreground">
                      {resolveTechniqueName(item.technique, config)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <StatusPill status={item.playback.status} />
                      <WarningBadge warnings={item.warnings} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted">
                      {item.eventId}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
