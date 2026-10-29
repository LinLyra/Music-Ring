"use client";

import Link from "next/link";

import ConnectionBadge from "@/components/ConnectionBadge";
import CurrentStateCards from "@/components/CurrentStateCards";
import ErrorBanner from "@/components/ErrorBanner";
import GestureGallery from "@/components/GestureGallery";
import HistoryTable from "@/components/HistoryTable";
import InstrumentBoard from "@/components/InstrumentBoard";
import ScoreDisplay from "@/components/ScoreDisplay";
import SkeletonDashboard from "@/components/SkeletonDashboard";
import { useDashboardData } from "@/lib/useDashboardData";

export default function Dashboard() {
  const { state, history, config, connection, ringConnection, lastError, initialLoading, selection, scoreState } =
    useDashboardData();

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-8 sm:py-8">
      {/* 顶部标题栏 */}
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Virtual Instrument Console
          </h1>
          <p className="mt-1 text-sm text-muted">
            Play the instruments below. Ring connection is separate.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/settings"
            className="rounded-lg border border-border bg-surface px-3.5 py-1.5 text-sm font-medium text-foreground transition hover:bg-surface-muted"
          >
            Ring settings
          </Link>
          <ConnectionBadge status={ringConnection} label="Ring" />
          <ConnectionBadge status={connection} />
        </div>
      </header>

      {/* 错误提示：仅在断连且已有过数据时展示（首屏加载不打扰） */}
      {connection === "disconnected" && lastError && !initialLoading && (
        <ErrorBanner message={lastError} />
      )}

      <InstrumentBoard
        config={config}
        instrument={selection.instrument}
        noteKey={selection.key}
        activeNote={state?.note?.code ?? null}
      />
      <GestureGallery />

      {initialLoading ? (
        <SkeletonDashboard />
      ) : (
        <>
          {scoreState?.active && <ScoreDisplay scoreState={scoreState} />}
          <CurrentStateCards state={state} config={config} selection={selection} />
          <HistoryTable items={history} config={config} />
        </>
      )}
    </main>
  );
}
