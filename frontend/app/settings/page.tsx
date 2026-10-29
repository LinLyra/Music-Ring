import type { Metadata } from "next";

import RingSettings from "@/components/RingSettings";

export const metadata: Metadata = {
  title: "Ring settings · Virtual Instrument Console",
  description: "Connect a BLE ring, record custom gestures, and test them live",
};

export default function SettingsPage() {
  return <RingSettings />;
}
