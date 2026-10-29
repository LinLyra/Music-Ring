import { describe, expect, it } from "vitest";
import {
  formatTime,
  mergeHistory,
  resolveInstrumentName,
  resolveNoteLabel,
  resolveTechniqueName,
} from "@/lib/format";
import type { AppConfig, HistoryItem } from "@/types/domain";

function makeItem(
  eventId: string,
  createdAt: string,
  overrides: Partial<HistoryItem> = {},
): HistoryItem {
  return {
    eventId,
    instrument: { code: "pipa", name: "Pipa" },
    key: "D",
    note: { code: "so", label: "so" },
    technique: { code: "normal", name: "Normal" },
    playback: { status: "played", played: true },
    warnings: [],
    createdAt,
    ...overrides,
  };
}

describe("formatTime", () => {
  it("格式化 ISO8601 为 HH:mm:ss", () => {
    // 使用带时区的时间，断言与本地时区无关的秒位；此处用 UTC 明确构造
    const out = formatTime("2026-07-23T22:43:05Z");
    expect(out).toMatch(/^\d{2}:\d{2}:\d{2}$/);
  });

  it("空/非法输入返回占位符而不抛错", () => {
    expect(formatTime(null)).toBe("—");
    expect(formatTime(undefined)).toBe("—");
    expect(formatTime("not-a-date")).toBe("—");
  });
});

describe("resolveInstrumentName", () => {
  it("优先后端 name", () => {
    expect(resolveInstrumentName({ code: "pipa", name: "Pipa" })).toBe("Pipa");
  });
  it("name 缺失时回退本地映射", () => {
    expect(resolveInstrumentName({ code: "guitar", name: "" })).toBe("Guitar");
  });
  it("空值返回占位符", () => {
    expect(resolveInstrumentName(null)).toBe("—");
  });
});

describe("resolveNoteLabel", () => {
  it("优先后端 label", () => {
    expect(resolveNoteLabel({ code: "so", label: "so" })).toBe("so");
  });
  it("do_high 在缺 label 时映射为 do", () => {
    expect(resolveNoteLabel({ code: "do_high", label: "" })).toBe("do");
  });
});

describe("resolveTechniqueName", () => {
  const config: AppConfig = {
    instruments: [],
    keys: [],
    notes: [],
    techniques: [{ code: "slide", name: "滑音" }],
  };

  it("技法为空返回Unknown technique", () => {
    expect(resolveTechniqueName(null)).toBe("Unknown technique");
    expect(resolveTechniqueName({ code: "", name: "" })).toBe("Unknown technique");
  });

  it("优先后端 name", () => {
    expect(resolveTechniqueName({ code: "normal", name: "Normal" })).toBe(
      "Normal",
    );
  });

  it("name 缺失时使用 config 映射", () => {
    expect(resolveTechniqueName({ code: "slide", name: "" }, config)).toBe(
      "滑音",
    );
  });

  it("未知 code 返回Unknown technique", () => {
    expect(resolveTechniqueName({ code: "mystery", name: "" })).toBe(
      "Unknown technique",
    );
  });
});

describe("mergeHistory", () => {
  it("按 createdAt 倒序排列（最新在前）", () => {
    const merged = mergeHistory(
      [],
      [
        makeItem("a", "2026-07-23T22:00:00Z"),
        makeItem("b", "2026-07-23T22:05:00Z"),
      ],
    );
    expect(merged.map((i) => i.eventId)).toEqual(["b", "a"]);
  });

  it("按 eventId 去重，incoming 覆盖 prev", () => {
    const prev = [makeItem("a", "2026-07-23T22:00:00Z", { key: "C" })];
    const incoming = [makeItem("a", "2026-07-23T22:00:00Z", { key: "D" })];
    const merged = mergeHistory(prev, incoming);
    expect(merged).toHaveLength(1);
    expect(merged[0].key).toBe("D");
  });

  it("截断到 limit 条", () => {
    const items = Array.from({ length: 60 }, (_, i) =>
      makeItem(`e${i}`, `2026-07-23T22:${String(i).padStart(2, "0")}:00Z`),
    );
    const merged = mergeHistory([], items, 50);
    expect(merged).toHaveLength(50);
    // 最新（分钟最大）应在最前
    expect(merged[0].eventId).toBe("e59");
  });
});
