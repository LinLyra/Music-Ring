# Music Ring

A smart-ring music instrument demo: the phone or web console sends notes, a BLE ring can change playing technique with gestures, and the local host plays WAV samples.

**Public console:** [https://linlyra.github.io/Music-Ring/](https://linlyra.github.io/Music-Ring/)

That page is the visual demo (instruments, notes, gesture cards). Real sound and ring BLE still run on a computer next to the ring.

Built on the public [OpenZilo](https://github.com/ziloai/openzilo) SDK for scan, connection, system info, IMU, button and gesture events, and audio transfer. This repo adds the performance session, technique mapping, and the English web console.

It does **not** ship heart-rate, HRV, stress scores, or a multi-sensor sync claim.

## What runs without a ring

Backend API, web console, phone client, and tests run with no hardware. Playback uses `backend/audio/`. Missing files return `AUDIO_NOT_FOUND`.

A ring is only needed for BLE scan, IMU, live gesture events, and on-device audio download.

## Ring SDK

`backend/config.json` defaults `ring.sdk` to `openzilo`:

```bash
cd backend
uv sync
uv run uvicorn app.main:app --host 0.0.0.0 --port 8080
```

Local HMM gesture templates and friend-trained models are **not** included in this public repo. With OpenZilo connected, on-device gesture events can still drive technique changes when the ring firmware reports them.

## Run locally (sound + ring)

Backend:

```bash
cd backend
uv sync
uv run uvicorn app.main:app --host 0.0.0.0 --port 8080
```

Web console:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000. Ring settings: http://localhost:3000/settings.

Phone client (Expo):

```bash
cd player-frontend
npm install
npx expo start
```

Optional spatial HUD:

```bash
cd pico-frontend
pnpm install
pnpm dev
```

## Layout

| Path | Role |
| --- | --- |
| `backend/` | FastAPI session, audio playback, OpenZilo adapter |
| `frontend/` | Next.js console (instruments, notes, gesture demos) |
| `player-frontend/` | Expo player |
| `pico-frontend/` | Spatial performance HUD |

## Gesture demos (UI)

The console shows English motion cards for Finger snap, Pinch, Shake, Flick, and Wipe. Those pictures are for the public demo UI. They are not a claim that local HMM models are shipped in this repository.
