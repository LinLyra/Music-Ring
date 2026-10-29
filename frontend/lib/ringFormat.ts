// 戒指测试事件的纯展示辅助（可单测）。

import type {
  DeviceEvent,
  EventLogItem,
  ImuSample,
  RecognitionEvent,
  RecordingEvent,
} from "@/types/ring";

/** 加速度/陀螺仪三轴合成幅值（用于实时曲线）。 */
export function imuMagnitude(sample: ImuSample): { accel: number; gyro: number } {
  const [ax, ay, az, gx, gy, gz] = sample;
  return {
    accel: Math.sqrt(ax * ax + ay * ay + az * az),
    gyro: Math.sqrt(gx * gx + gy * gy + gz * gz),
  };
}

/** 把设备事件转成日志文案 + 语气色。 */
export function describeDeviceEvent(ev: DeviceEvent): { text: string; tone: EventLogItem["tone"] } {
  const d = ev.data;
  switch (d.kind) {
    case "key_single":
      return { text: "Button press (toggles gesture and recording mode)", tone: "info" };
    case "double_tap":
      return { text: "IMU double-tap", tone: "info" };
    case "hmm_gesture":
      return { text: `Built-in gesture: ${d.name ?? d.gestureId ?? "?"}`, tone: "info" };
    case "info":
      return { text: d.message ?? "Notice", tone: "warn" };
    case "error":
      return { text: d.message ?? "Error", tone: "danger" };
    default:
      return { text: d.message ?? d.kind, tone: "info" };
  }
}

export function describeRecognition(ev: RecognitionEvent): { text: string; tone: EventLogItem["tone"] } {
  const pct = Math.round(ev.data.confidence * 100);
  return { text: `Recognized "${ev.data.name}" (${pct}%)`, tone: "ok" };
}

/** 录制Status机 -> 用户可读提示。 */
export function describeRecording(ev: RecordingEvent): string {
  const d = ev.data;
  switch (d.state) {
    case "started":
      return `Recording "${d.name}", ${d.targetReps} repetitions`;
    case "rep_recording":
      return `Recording repetition ${(d.currentRep ?? 0) + 1}...`;
    case "rep_saved":
      return `Saved repetition ${d.currentRep}/${d.targetReps}`;
    case "rep_too_short":
      return d.message ?? "Recording was too short. Record this repetition again.";
    case "done":
      return `Gesture "${d.name}" saved (${d.sampleCount} samples)`;
    case "cancelled":
      return "Recording cancelled";
    default:
      return d.state;
  }
}
