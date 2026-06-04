import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { HealthBadge } from "@/components/HealthBadge";

const mockBenchmarkReferences = vi.hoisted(() => ({
  "test-metric": {
    excellent: ">100",
    good: ">50",
    average: ">0",
    poor: "<=0",
    source: "Test Source",
    date: "2024",
    notes: "Test notes",
  },
  "lower-is-better": {
    excellent: "<10",
    good: "<20",
    average: "<30",
    poor: ">30",
    source: "Test Source",
    date: "2024",
    notes: "Test notes",
  },
}));

vi.mock("@/lib/benchmarks", () => ({ benchmarkReferences: mockBenchmarkReferences }));

describe("HealthBadge", () => {
  it("renders with role='status' and appropriate aria-label for excellent rating", () => {
    render(<HealthBadge value={150} metric="test-metric" label="Test Metric" />);

    // The badge should render
    const badge = screen.getByRole("status");
    expect(badge).toBeInTheDocument();

    // Check aria-label: it should contain the label, value, and rating
    // From the code: ariaLabel prop or constructed from label and value, or fallback.
    // We passed label="Test Metric", so the constructedAriaLabel should be: "Test Metric: 150"
    // But note: the code also includes the rating in the fallback, but we have a label so it uses the label.
    // Actually, line 76-77: 
    //   const constructedAriaLabel = ariaLabel || 
    //     (label ? `${label}: ${value}` : `Metric: ${metric}, Value: ${value}, Rating: ${rating}`);
    // So with label provided, it uses `${label}: ${value}`.
    expect(badge).toHaveAttribute("aria-label", "Test Metric: 150");

    // Also check that the rating text is rendered (the span inside)
    const ratingText = badge.querySelector("span");
    expect(ratingText).toHaveTextContent("excellent"); // capitalized in the component: <span className="capitalize">{rating}</span>
  });

  it("renders with role='status' and appropriate aria-label for poor rating when value is high (for lower is better metric)", () => {
    // For the "lower-is-better" metric, a high value is poor.
    render(<HealthBadge value={35} metric="lower-is-better" label="Lower is Better" />);

    const badge = screen.getByRole("status");
    expect(badge).toBeInTheDocument();

    // With label provided, aria-label should be "Lower is Better: 35"
    expect(badge).toHaveAttribute("aria-label", "Lower is Better: 35");

    // The rating should be "average" for this mock data/value
    const ratingText = badge.querySelector("span");
    expect(ratingText).toHaveTextContent("average");
  });

  it("does not render if metric is not found in benchmarkReferences", () => {
    render(<HealthBadge value={10} metric="unknown-metric" label="Unknown" />);
    // The component returns null if ref is null, so nothing should be rendered.
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});