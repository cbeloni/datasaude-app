export const palette = {
  bg: {
    canvas: "#FAFAF7",
    surface: "#FFFFFF",
    sunken: "#F4F4EE",
    inverse: "#0E1420",
  },
  ink: {
    900: "#0E1420",
    800: "#1A1F2E",
    700: "#2A3142",
    600: "#3D465B",
    500: "#5A6478",
    400: "#8189A0",
    300: "#A8AEC0",
    200: "#D2D6E0",
    100: "#E8EAF0",
    50: "#F2F3F7",
  },
  primary: {
    50: "#ECFDF5",
    100: "#D1FAE5",
    200: "#A7F3D0",
    300: "#6EE7B7",
    400: "#34D399",
    500: "#0F766E",
    600: "#0B5E58",
    700: "#0A4F4A",
    800: "#083F3B",
    900: "#06322F",
  },
  accent: {
    50: "#ECFEFF",
    100: "#CFFAFE",
    400: "#22D3EE",
    500: "#0891B2",
    600: "#0E7490",
    700: "#155E75",
  },
  success: {
    50: "#ECFDF5",
    500: "#059669",
    600: "#047857",
    700: "#065F46",
  },
  warning: {
    50: "#FFFBEB",
    500: "#D97706",
    600: "#B45309",
    700: "#92400E",
  },
  danger: {
    50: "#FEF2F2",
    500: "#E11D48",
    600: "#BE123C",
    700: "#9F1239",
  },
  rose: {
    500: "#881337",
    600: "#6B0F2C",
  },
  border: {
    subtle: "#EDEEF2",
    default: "#E0E2EA",
    strong: "#C7CAD4",
  },
  airQuality: {
    n1: "#059669",
    n2: "#D97706",
    n3: "#E11D48",
    n4: "#881337",
  },
};

export const typography = {
  display: '"Fraunces", "Times New Roman", Georgia, serif',
  body:
    '"Inter Tight", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  mono: '"JetBrains Mono", "SF Mono", Consolas, monospace',
};

export const radii = {
  xs: 4,
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  pill: 999,
};

export const shadows = {
  none: "none",
  xs: "0 1px 2px 0 rgba(14, 20, 32, 0.04)",
  sm: "0 1px 2px 0 rgba(14, 20, 32, 0.06), 0 1px 3px 0 rgba(14, 20, 32, 0.04)",
  md:
    "0 4px 8px -2px rgba(14, 20, 32, 0.06), 0 2px 4px -2px rgba(14, 20, 32, 0.04)",
  lg:
    "0 12px 20px -8px rgba(14, 20, 32, 0.10), 0 4px 8px -4px rgba(14, 20, 32, 0.06)",
  xl:
    "0 24px 40px -12px rgba(14, 20, 32, 0.14), 0 8px 16px -8px rgba(14, 20, 32, 0.08)",
  focus: "0 0 0 3px rgba(15, 118, 110, 0.20)",
};

export const motion = {
  duration: {
    fast: 150,
    base: 220,
    slow: 320,
  },
  easing: {
    standard: "cubic-bezier(0.2, 0.0, 0, 1)",
    emphasized: "cubic-bezier(0.3, 0.0, 0.2, 1)",
  },
};

export const layout = {
  drawerWidth: 248,
  drawerCollapsedWidth: 72,
  navbarHeight: 64,
  contentMaxWidth: 1440,
};
