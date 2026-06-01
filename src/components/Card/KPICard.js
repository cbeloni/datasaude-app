import React from "react";
import PropTypes from "prop-types";
import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const TONE_GRADIENTS = {
  success: ["#10B981", "#047857"],
  warning: ["#F59E0B", "#B45309"],
  error: ["#F43F5E", "#BE123C"],
  rose: ["#E11D48", "#881337"],
  info: ["#22D3EE", "#0E7490"],
  primary: ["#34D399", "#0F766E"],
  neutral: ["#A8AEC0", "#5A6478"],
};

const TONE_TEXT = {
  success: { main: "#047857", soft: "#ECFDF5" },
  warning: { main: "#B45309", soft: "#FFFBEB" },
  error: { main: "#BE123C", soft: "#FEF2F2" },
  rose: { main: "#9F1239", soft: "#FEF2F2" },
  info: { main: "#0E7490", soft: "#ECFEFF" },
  primary: { main: "#0B5E58", soft: "#ECFDF5" },
  neutral: { main: "#5A6478", soft: "#F2F3F7" },
};

export default function KPICard({
  icon: Icon,
  tone = "primary",
  label,
  value,
  description,
  footer,
  children,
  sx,
}) {
  const theme = useTheme();
  const [g1, g2] = TONE_GRADIENTS[tone] || TONE_GRADIENTS.neutral;
  const colors = TONE_TEXT[tone] || TONE_TEXT.neutral;

  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        position: "relative",
        overflow: "hidden",
        transition: theme.transitions.create(
          ["border-color", "transform", "box-shadow"],
          { duration: 200 }
        ),
        "&:hover": {
          borderColor: theme.palette.divider,
          transform: "translateY(-2px)",
          boxShadow: theme.tokens.shadows.md,
        },
        "&::before": {
          content: '""',
          position: "absolute",
          inset: "0 0 auto 0",
          height: 4,
          background: `linear-gradient(90deg, ${g1}, ${g2})`,
        },
        ...sx,
      }}
    >
      <CardContent sx={{ p: 2.5, pt: 2.75, "&:last-child": { pb: 2.5 } }}>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          {Icon && (
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${g1}, ${g2})`,
                color: "#fff",
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
                boxShadow: `0 6px 14px -4px ${g2}66`,
                "& svg": { fontSize: 22 },
              }}
            >
              <Icon />
            </Box>
          )}
          <Box sx={{ minWidth: 0, flex: 1 }}>
            {label && (
              <Typography
                variant="overline"
                sx={{
                  display: "block",
                  color: "text.secondary",
                  fontSize: "0.6875rem",
                  letterSpacing: "0.12em",
                  lineHeight: 1.3,
                }}
                noWrap
                title={typeof label === "string" ? label : undefined}
              >
                {label}
              </Typography>
            )}
            {value && (
              <Typography
                sx={{
                  fontFamily: theme.tokens.typography.display,
                  fontSize: "1.375rem",
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  lineHeight: 1.2,
                  color: colors.main,
                  mt: 0.25,
                }}
              >
                {value}
              </Typography>
            )}
            {description && (
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mt: 0.5 }}
              >
                {description}
              </Typography>
            )}
          </Box>
        </Stack>
        {children && <Box sx={{ mt: 2 }}>{children}</Box>}
        {footer && (
          <Box
            sx={{
              mt: 2,
              pt: 1.5,
              borderTop: `1px solid ${theme.palette.divider}`,
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "text.secondary",
              fontSize: "0.75rem",
              "& svg": { fontSize: 14 },
            }}
          >
            {footer}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

KPICard.propTypes = {
  icon: PropTypes.elementType,
  tone: PropTypes.oneOf([
    "success",
    "warning",
    "error",
    "info",
    "primary",
    "rose",
    "neutral",
  ]),
  label: PropTypes.node,
  value: PropTypes.node,
  description: PropTypes.node,
  footer: PropTypes.node,
  children: PropTypes.node,
  sx: PropTypes.object,
};
