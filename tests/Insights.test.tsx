import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { userEvent } from "@testing-library/user-event";
import { Insights } from "@/components/Insights";

const mockGenerateInsights = vi.hoisted(() => vi.fn());
vi.mock("@/lib/insights-engine", () => ({
  generateInsights: mockGenerateInsights,
}));

vi.mock("@/components/CurrencyProvider", () => ({
  useCurrency: () => ({ currency: "USD" }),
}));

describe("Insights", () => {
  const defaultProps = {
    title: "Test Title",
    description: "Test Description",
    category: "test",
    inputs: [{ id: "in1", label: "Input 1", value: 100, type: "currency" }],
    outputs: [{ id: "out1", label: "Output 1", value: 200, type: "currency", isPrimary: true }],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initially shows the Get Insights button and no live regions", async () => {
    render(<Insights {...defaultProps} />);

    const button = await screen.findByRole("button", { name: /get insights/i });
    expect(button).toBeInTheDocument();

    expect(screen.queryByRole("status", { name: /loading insights/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("shows loading status region when insights generation starts", async () => {
    mockGenerateInsights.mockImplementationOnce(
      () => new Promise<string>(() => {})
    );

    render(<Insights {...defaultProps} />);
    const button = await screen.findByRole("button", { name: /get insights/i });
    await userEvent.click(button);

    expect(screen.getByRole("status", { name: /loading insights/i })).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("shows alert role when insights generation fails", async () => {
    mockGenerateInsights.mockRejectedValueOnce(new Error("Failed"));

    render(<Insights {...defaultProps} />);
    const button = await screen.findByRole("button", { name: /get insights/i });
    await userEvent.click(button);

    const alert = await screen.findByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent(/unable to generate insights/i);
    expect(screen.queryByRole("status", { name: /loading insights/i })).not.toBeInTheDocument();
  });

  it("shows insights container with role='status' and aria-live='polite' when successful", async () => {
    mockGenerateInsights.mockResolvedValueOnce("Test insights");

    render(<Insights {...defaultProps} />);
    const button = await screen.findByRole("button", { name: /get insights/i });
    await userEvent.click(button);

    const proseStatus = await screen.findByText("Test insights").then(el => el.closest("[role='status']"));
    expect(proseStatus).toBeInTheDocument();
    expect(proseStatus).toHaveAttribute("aria-live", "polite");
    expect(proseStatus).toHaveTextContent(/test insights/i);
    expect(screen.queryByRole("status", { name: /loading insights/i })).not.toBeInTheDocument();
  });
});
