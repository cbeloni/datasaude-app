import { createTheme } from "@mui/material/styles";
import { palette, typography, radii, shadows, motion, layout } from "./tokens";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      light: palette.primary[400],
      main: palette.primary[500],
      dark: palette.primary[700],
      contrastText: "#FFFFFF",
    },
    secondary: {
      light: palette.accent[400],
      main: palette.accent[500],
      dark: palette.accent[700],
      contrastText: "#FFFFFF",
    },
    success: {
      light: palette.success[50],
      main: palette.success[500],
      dark: palette.success[700],
      contrastText: "#FFFFFF",
    },
    warning: {
      light: palette.warning[50],
      main: palette.warning[500],
      dark: palette.warning[700],
      contrastText: "#FFFFFF",
    },
    error: {
      light: palette.danger[50],
      main: palette.danger[500],
      dark: palette.danger[700],
      contrastText: "#FFFFFF",
    },
    info: {
      light: palette.accent[100],
      main: palette.accent[500],
      dark: palette.accent[700],
      contrastText: "#FFFFFF",
    },
    background: {
      default: palette.bg.canvas,
      paper: palette.bg.surface,
    },
    text: {
      primary: palette.ink[800],
      secondary: palette.ink[500],
      disabled: palette.ink[300],
    },
    divider: palette.border.subtle,
    grey: {
      50: palette.ink[50],
      100: palette.ink[100],
      200: palette.ink[200],
      300: palette.ink[300],
      400: palette.ink[400],
      500: palette.ink[500],
      600: palette.ink[600],
      700: palette.ink[700],
      800: palette.ink[800],
      900: palette.ink[900],
    },
  },
  shape: {
    borderRadius: radii.md,
  },
  typography: {
    fontFamily: typography.body,
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
    h1: {
      fontFamily: typography.display,
      fontWeight: 500,
      fontSize: "2.75rem",
      lineHeight: 1.1,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontFamily: typography.display,
      fontWeight: 500,
      fontSize: "2.125rem",
      lineHeight: 1.15,
      letterSpacing: "-0.018em",
    },
    h3: {
      fontFamily: typography.display,
      fontWeight: 500,
      fontSize: "1.625rem",
      lineHeight: 1.2,
      letterSpacing: "-0.014em",
    },
    h4: {
      fontFamily: typography.body,
      fontWeight: 600,
      fontSize: "1.25rem",
      lineHeight: 1.3,
      letterSpacing: "-0.01em",
    },
    h5: {
      fontFamily: typography.body,
      fontWeight: 600,
      fontSize: "1.0625rem",
      lineHeight: 1.4,
    },
    h6: {
      fontFamily: typography.body,
      fontWeight: 600,
      fontSize: "0.9375rem",
      lineHeight: 1.4,
      letterSpacing: "0.005em",
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: "0.9375rem",
      lineHeight: 1.5,
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: "0.8125rem",
      lineHeight: 1.5,
      letterSpacing: "0.01em",
    },
    body1: {
      fontSize: "0.9375rem",
      lineHeight: 1.55,
    },
    body2: {
      fontSize: "0.8125rem",
      lineHeight: 1.55,
    },
    button: {
      fontWeight: 500,
      fontSize: "0.875rem",
      letterSpacing: "0.01em",
      textTransform: "none",
    },
    caption: {
      fontSize: "0.75rem",
      lineHeight: 1.4,
      letterSpacing: "0.02em",
      color: palette.ink[500],
    },
    overline: {
      fontSize: "0.6875rem",
      fontWeight: 600,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      lineHeight: 1.4,
    },
  },
  shadows: [
    shadows.none,
    shadows.xs,
    shadows.sm,
    shadows.sm,
    shadows.md,
    shadows.md,
    shadows.md,
    shadows.lg,
    shadows.lg,
    shadows.lg,
    shadows.lg,
    shadows.lg,
    shadows.xl,
    shadows.xl,
    shadows.xl,
    shadows.xl,
    shadows.xl,
    shadows.xl,
    shadows.xl,
    shadows.xl,
    shadows.xl,
    shadows.xl,
    shadows.xl,
    shadows.xl,
    shadows.xl,
  ],
  transitions: {
    duration: {
      shortest: motion.duration.fast,
      shorter: motion.duration.fast,
      short: motion.duration.base,
      standard: motion.duration.base,
      complex: motion.duration.slow,
    },
    easing: {
      easeInOut: motion.easing.standard,
      easeOut: motion.easing.emphasized,
      easeIn: motion.easing.standard,
      sharp: motion.easing.emphasized,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "html, body": {
          backgroundColor: palette.bg.canvas,
          color: palette.ink[800],
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          textRendering: "optimizeLegibility",
        },
        "*::selection": {
          backgroundColor: palette.primary[100],
          color: palette.primary[800],
        },
        "*:focus-visible": {
          outline: "none",
          boxShadow: shadows.focus,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: radii.md,
          paddingInline: 18,
          paddingBlock: 9,
          fontWeight: 500,
        },
        sizeSmall: {
          paddingInline: 12,
          paddingBlock: 6,
        },
        sizeLarge: {
          paddingInline: 22,
          paddingBlock: 12,
          fontSize: "0.9375rem",
        },
        containedPrimary: {
          backgroundColor: palette.primary[500],
          "&:hover": {
            backgroundColor: palette.primary[600],
          },
        },
        outlined: {
          borderColor: palette.border.default,
          color: palette.ink[800],
          "&:hover": {
            backgroundColor: palette.bg.sunken,
            borderColor: palette.border.strong,
          },
        },
        text: {
          color: palette.ink[700],
          "&:hover": {
            backgroundColor: palette.bg.sunken,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
        outlined: {
          borderColor: palette.border.subtle,
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: radii.lg,
          border: `1px solid ${palette.border.subtle}`,
          backgroundColor: palette.bg.surface,
          backgroundImage: "none",
          transition: `border-color ${motion.duration.base}ms ${motion.easing.standard}, box-shadow ${motion.duration.base}ms ${motion.easing.standard}`,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        size: "small",
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: radii.md,
          backgroundColor: palette.bg.surface,
          "& fieldset": {
            borderColor: palette.border.default,
          },
          "&:hover fieldset": {
            borderColor: palette.border.strong,
          },
          "&.Mui-focused fieldset": {
            borderWidth: 1,
            borderColor: palette.primary[500],
          },
        },
        input: {
          padding: "10px 14px",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: palette.ink[500],
          "&.Mui-focused": {
            color: palette.primary[600],
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: radii.pill,
          fontWeight: 500,
          fontSize: "0.75rem",
          letterSpacing: "0.01em",
          height: 24,
        },
        outlined: {
          borderColor: palette.border.default,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: palette.ink[800],
          fontSize: "0.75rem",
          fontWeight: 500,
          padding: "6px 10px",
          borderRadius: radii.sm,
        },
        arrow: {
          color: palette.ink[800],
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
        color: "transparent",
      },
      styleOverrides: {
        root: {
          backgroundColor: palette.bg.surface,
          borderBottom: `1px solid ${palette.border.subtle}`,
          color: palette.ink[800],
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: palette.bg.surface,
          borderRight: `1px solid ${palette.border.subtle}`,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: palette.border.subtle,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: palette.border.subtle,
        },
        head: {
          fontWeight: 600,
          color: palette.ink[600],
          fontSize: "0.75rem",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          backgroundColor: palette.bg.sunken,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 6,
          borderRadius: radii.pill,
          backgroundColor: palette.ink[100],
        },
        bar: {
          borderRadius: radii.pill,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: radii.md,
          fontSize: "0.875rem",
        },
        standardSuccess: {
          backgroundColor: palette.success[50],
          color: palette.success[700],
        },
        standardWarning: {
          backgroundColor: palette.warning[50],
          color: palette.warning[700],
        },
        standardError: {
          backgroundColor: palette.danger[50],
          color: palette.danger[700],
        },
        standardInfo: {
          backgroundColor: palette.accent[50],
          color: palette.accent[700],
        },
      },
    },
  },
});

theme.tokens = { palette, typography, radii, shadows, motion, layout };

export { palette, typography, radii, shadows, motion, layout };
export default theme;
