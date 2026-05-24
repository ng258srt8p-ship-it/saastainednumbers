import { describe, it, expect } from "vitest";
import { calculateTimeToValue } from "@/calculators/engine/time-to-value";

describe("calculateTimeToValue", () => {
  it("returns Good status when below target", () => {
    const r = calculateTimeToValue({ totalDaysToValue: 5, targetDays: 10, completedUsers: 80, totalUsers: 100 });
    expect(r.averageDaysToValue).toBe(5);
    expect(r.onTrackPercent).toBe(80);
    expect(r.status).toBe("Good");
    expect(r.daysGap).toBe(5);
  });

  it("returns Poor status when well above target", () => {
    const r = calculateTimeToValue({ totalDaysToValue: 20, targetDays: 10, completedUsers: 30, totalUsers: 100 });
    expect(r.status).toBe("Poor");
    expect(r.daysGap).toBe(-10);
  });

  it("throws for negative values", () => {
    expect(() => calculateTimeToValue({ totalDaysToValue: 5, targetDays: -1, completedUsers: 10, totalUsers: 100 })).toThrow();
  });
});
