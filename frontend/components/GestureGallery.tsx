"use client";

interface GestureDemo {
  title: string;
  technique: string;
  motion: string;
  src: string;
  motionClass: string;
}

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const DEMOS: GestureDemo[] = [
  {
    title: "Finger snap",
    technique: "Vibrato",
    motion: "Snap the thumb against the middle finger.",
    src: `${BASE}/gestures/finger-snap.jpg`,
    motionClass: "gesture-snap",
  },
  {
    title: "Pinch",
    technique: "Strum",
    motion: "Pinch the fingers closed.",
    src: `${BASE}/gestures/pinch.jpg`,
    motionClass: "gesture-pinch",
  },
  {
    title: "Shake",
    technique: "Tremolo",
    motion: "Shake the hand from side to side.",
    src: `${BASE}/gestures/shake.jpg`,
    motionClass: "gesture-shake",
  },
  {
    title: "Flick",
    technique: "Double pluck",
    motion: "Flick the wrist outward.",
    src: `${BASE}/gestures/flick.jpg`,
    motionClass: "gesture-flick",
  },
  {
    title: "Wipe",
    technique: "Split",
    motion: "Sweep back and forth like a wiper.",
    src: `${BASE}/gestures/wipe.jpg`,
    motionClass: "gesture-wipe",
  },
];

export default function GestureGallery() {
  return (
    <section aria-label="Gesture demos" className="flex flex-col gap-4">
      <header>
        <h2 className="text-lg font-semibold text-foreground">Gesture demos</h2>
        <p className="mt-1 text-sm text-muted">
          Each picture loops the motion the ring listens for. The badge is the technique that motion plays.
        </p>
      </header>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DEMOS.map((item) => (
          <article key={item.title} className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
              <span className="rounded-full border border-border bg-surface-muted px-2.5 py-1 text-xs text-foreground">
                {item.technique}
              </span>
            </div>
            <div className="flex h-44 items-center justify-center overflow-hidden rounded-xl bg-white">
              <img
                src={item.src}
                alt={item.motion}
                className={`h-40 w-40 object-contain ${item.motionClass}`}
              />
            </div>
            <p className="text-sm text-muted">{item.motion}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
