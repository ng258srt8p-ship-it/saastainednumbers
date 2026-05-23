export type SpacingKey = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24;
export type RadiusKey = "none" | "sm" | "md" | "lg" | "xl" | "full";
export type ShadowKey = "sm" | "md" | "lg" | "xl";

export const colors = {
  brand: {
    50: "#eff6ff", 100: "#dbeafe", 200: "#bfdbfe", 300: "#93c5fd",
    400: "#60a5fa", 500: "#3b82f6", 600: "#2563eb", 700: "#1d4ed8",
    800: "#1e40af", 900: "#1e3a8a", 950: "#172554",
  },
  secondary: {
    50: "#f0fdfa", 100: "#ccfbf1", 200: "#99f6e4", 300: "#5eead4",
    400: "#2dd4bf", 500: "#14b8a6", 600: "#0d9488", 700: "#0f766e",
    800: "#115e59", 900: "#134e4a", 950: "#042f2e",
  },
  accent: {
    50: "#fffbeb", 100: "#fef3c7", 200: "#fde68a", 300: "#fcd34d",
    400: "#fbbf24", 500: "#f59e0b", 600: "#d97706", 700: "#b45309",
    800: "#92400e", 900: "#78350f", 950: "#451a03",
  },
  semantic: {
    success: "#22c55e",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",
  },
  gray: {
    50: "#f9fafb", 100: "#f3f4f6", 200: "#e5e7eb", 300: "#d1d5db",
    400: "#9ca3af", 500: "#6b7280", 600: "#4b5563", 700: "#374151",
    800: "#1f2937", 900: "#111827", 950: "#030712",
  },
} as const;

export const typography = {
  fontFamily: {
    body: "var(--font-body), system-ui, sans-serif",
    heading: "var(--font-heading), system-ui, sans-serif",
  },
  fontSize: {
    xs: ["0.75rem", { lineHeight: "1rem" }],
    sm: ["0.875rem", { lineHeight: "1.25rem" }],
    base: ["1rem", { lineHeight: "1.5rem" }],
    lg: ["1.125rem", { lineHeight: "1.75rem" }],
    xl: ["1.25rem", { lineHeight: "1.75rem" }],
    "2xl": ["1.5rem", { lineHeight: "2rem" }],
    "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
    "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
    "5xl": ["3rem", { lineHeight: "1.16" }],
    "6xl": ["3.75rem", { lineHeight: "1.1" }],
  } as const,
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
} as const;

export const spacing: Record<SpacingKey, string> = {
  0: "0px", 1: "0.25rem", 2: "0.5rem", 3: "0.75rem", 4: "1rem",
  5: "1.25rem", 6: "1.5rem", 8: "2rem", 10: "2.5rem", 12: "3rem",
  16: "4rem", 20: "5rem", 24: "6rem",
};

export const borderRadius: Record<RadiusKey, string> = {
  none: "0px", sm: "0.25rem", md: "0.375rem", lg: "0.5rem", xl: "0.75rem", full: "9999px",
};

export const shadows: Record<ShadowKey, string> = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
};

export const transitions = {
  duration: { fast: "150ms", normal: "200ms", slow: "300ms" },
  easing: { default: "ease-out", in: "ease-in", inOut: "ease-in-out" },
} as const;
