import { palette } from "./tokens";

export const chartPalette = [
  palette.primary[500],
  palette.accent[500],
  palette.warning[500],
  palette.danger[500],
  palette.success[500],
  palette.primary[300],
  palette.accent[400],
  palette.rose[500],
];

export const chartSeriesColors = {
  primary: palette.primary[500],
  accent: palette.accent[500],
  success: palette.success[500],
  warning: palette.warning[500],
  danger: palette.danger[500],
  rose: palette.rose[500],
  muted: palette.ink[400],
};

export const chartSx = {
  ".MuiChartsAxis-line, .MuiChartsAxis-tick": {
    stroke: palette.border.default,
  },
  ".MuiChartsAxis-tickLabel": {
    fill: palette.ink[500],
    fontSize: 12,
  },
  ".MuiChartsAxis-label": {
    fill: palette.ink[700],
    fontSize: 12,
    fontWeight: 500,
  },
  ".MuiChartsLegend-mark": {
    rx: 2,
  },
  ".MuiChartsLegend-label": {
    fill: palette.ink[700],
    fontSize: 12,
  },
  ".MuiChartsGrid-line": {
    stroke: palette.border.subtle,
    strokeDasharray: "3 3",
  },
};
