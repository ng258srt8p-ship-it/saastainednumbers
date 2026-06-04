import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { ShareButton } from "@/components/ShareButton";

// Mock navigator.clipboard
const writeText = vi.fn();
Object.defineProperty(navigator, "clipboard", {
  value: {
    writeText: writeText,
  },
  writable: true,
});

describe("ShareButton", () => {
  it("exposes aria-label 'Share' initially", () => {
    render(<ShareButton inputs={{ test: 1 }} category="test" slug="test-slug" />);
    const button = screen.getByRole("button", { name: /share/i });
    expect(button).toHaveAttribute("aria-label", "Share");
  });

  it("changes aria-label to 'Copied!' when copied", async () => {
    // Mock successful copy
    writeText.mockResolvedValueOnce(undefined);

    render(<ShareButton inputs={{ test: 1 }} category="test" slug="test-slug" />);
    const button = screen.getByRole("button", { name: /share/i });

    await userEvent.click(button);

    // Wait for the state update (the button text and aria-label change)
    expect(button).toHaveAttribute("aria-label", "Copied!");
    expect(button).toHaveTextContent("Copied!");
  });

  it("reverts aria-label to 'Share' after 2 seconds", async () => {
    writeText.mockResolvedValueOnce(undefined);

    render(<ShareButton inputs={{ test: 1 }} category="test" slug="test-slug" />);
    const button = await screen.findByRole("button", { name: /share/i });
    await userEvent.click(button);

    expect(screen.getByRole("button", { name: "Copied!" })).toHaveAttribute("aria-label", "Copied!");

    await new Promise((resolve) => setTimeout(resolve, 2050));

    expect(await screen.findByRole("button", { name: /share/i })).toHaveAttribute("aria-label", "Share");
  });
});