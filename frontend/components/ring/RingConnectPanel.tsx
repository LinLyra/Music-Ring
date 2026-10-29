"use client";

import { useEffect, useState } from "react";

import Button from "@/components/Button";
import ConnectionBadge from "@/components/ConnectionBadge";
import Input from "@/components/Input";
import ScanModal from "@/components/ring/ScanModal";
import { EMPTY_PLACEHOLDER } from "@/constants/enums";
import {
  type RingFavorite,
  loadFavorites,
  removeFavorite as removeFav,
} from "@/lib/ringFavorites";
import type { RingStatus } from "@/types/ring";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1.5">
      <span className="text-sm text-muted">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

export default function RingConnectPanel({
  status,
  busy,
  onConnect,
  onDisconnect,
}: {
  status: RingStatus | null;
  busy: boolean;
  onConnect: (address: string) => void;
  onDisconnect: () => void;
}) {
  const [address, setAddress] = useState("");
  const [scanOpen, setScanOpen] = useState(false);
  const [favorites, setFavorites] = useState<RingFavorite[]>([]);

  useEffect(() => {
    setFavorites(loadFavorites());
  }, [scanOpen]);

  const connection = status?.connection ?? "disconnected";
  const connected = connection === "connected";
  const reconnecting = connection === "reconnecting";
  const info = status?.deviceInfo ?? null;

  const handleScanSelect = (addr: string) => {
    setAddress(addr);
    onConnect(addr);
  };

  const handleRemoveFav = (addr: string) => {
    removeFav(addr);
    setFavorites(loadFavorites());
  };

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <header className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-foreground">Connect ring</h2>
        <ConnectionBadge status={connection} />
      </header>

      {connected || reconnecting ? (
        <div className="flex flex-col gap-4">
          {/* 实时模式指示 */}
          <div className="flex items-center gap-3">
            <span
              className={[
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium",
                status?.mode === "gesture"
                  ? "border-info/30 bg-info-soft text-info"
                  : status?.mode === "recording"
                    ? "border-warn/30 bg-warn-soft text-warn"
                    : "border-border bg-surface-muted text-muted",
              ].join(" ")}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  status?.mode === "gesture"
                    ? "bg-info"
                    : status?.mode === "recording"
                      ? "bg-warn animate-pulse"
                      : "bg-muted"
                }`}
              />
              {status?.mode === "gesture"
                ? "Gesture mode"
                : status?.mode === "recording"
                  ? "Recording mode"
                  : "Detecting..."}
            </span>
            {status?.mode === "recording" && (
              <span className="text-xs text-muted">Press the ring button once to enter gesture mode</span>
            )}
          </div>

          <div className="rounded-xl border border-border bg-surface-muted p-4">
            <InfoRow label="Device address" value={status?.address ?? EMPTY_PLACEHOLDER} />
            {info ? (
              <>
                <InfoRow label="Firmware" value={info.firmwareVersion} />
                <InfoRow label="Model" value={info.model} />
                <InfoRow
                  label="Battery"
                  value={`${info.batteryPercent}%${info.batteryCharging ? " (charging)" : ""}`}
                />
                <InfoRow label="SN" value={info.sn} />
              </>
            ) : (
              <p className="pt-1 text-sm text-muted">Device info is still loading or unavailable.</p>
            )}
          </div>
          <div>
            <Button variant="danger" onClick={onDisconnect} disabled={busy}>
              Disconnect
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Favorites */}
          {favorites.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium uppercase tracking-wider text-muted">
                Favorites
              </span>
              <ul className="flex flex-col gap-2">
                {favorites.map((f) => (
                  <li key={f.address} className="flex items-center gap-2">
                    <button
                      type="button"
                      className="flex flex-1 items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2 text-left transition hover:bg-surface-muted"
                      onClick={() => {
                        setAddress(f.address);
                        onConnect(f.address);
                      }}
                      disabled={busy}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" className="text-warning">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">
                          {f.name || "Unnamed device"}
                        </span>
                        <span className="font-mono text-xs text-muted">
                          {f.address}
                        </span>
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveFav(f.address)}
                      className="rounded p-1.5 text-muted transition hover:bg-danger-soft hover:text-danger"
                      title="Remove favorite"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 手动输入 + 扫描按钮 */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <Input
                label="Device address (MAC / UUID)"
                placeholder="Scan, or type an address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <Button variant="secondary" onClick={() => setScanOpen(true)} disabled={busy}>
              Scan
            </Button>
          </div>

          <div>
            <Button
              onClick={() => onConnect(address.trim())}
              disabled={busy || !address.trim()}
            >
              {connection === "connecting" ? "Connecting..." : "Connect"}
            </Button>
          </div>
        </div>
      )}

      <ScanModal
        open={scanOpen}
        onClose={() => setScanOpen(false)}
        onSelect={handleScanSelect}
      />
    </section>
  );
}
