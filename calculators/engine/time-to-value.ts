export interface TimeToValueParams { totalDaysToValue: number; targetDays: number; completedUsers: number; totalUsers: number; }
export interface TimeToValueResult { averageDaysToValue: number; onTrackPercent: number; status: string; daysGap: number; }
export function calculateTimeToValue(p: TimeToValueParams): TimeToValueResult {
  if (p.totalDaysToValue < 0 || p.targetDays <= 0 || p.completedUsers < 0 || p.totalUsers <= 0) throw new Error("Values must be positive");
  if (p.completedUsers > p.totalUsers) throw new Error("Completed users cannot exceed total");
  const avg = p.totalDaysToValue;
  const onTrack = p.completedUsers > 0 ? (p.completedUsers / p.totalUsers) * 100 : 0;
  const gap = p.targetDays - avg;
  const status = avg <= p.targetDays ? "Good" : avg <= p.targetDays * 1.5 ? "Needs Improvement" : "Poor";
  return { averageDaysToValue: avg, onTrackPercent: onTrack, status, daysGap: gap };
}
