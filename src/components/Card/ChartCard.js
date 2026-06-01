import React from "react";
import PropTypes from "prop-types";
import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function ChartCard({
  icon: Icon,
  title,
  subtitle,
  action,
  footer,
  children,
  height,
  sx,
}) {
  const theme = useTheme();

  return (
    <Card variant="outlined" sx={{ height: "100%", ...sx }}>
      <CardContent
        sx={{
          p: 2.5,
          pb: footer ? 0 : 2.5,
          "&:last-child": { pb: footer ? 0 : 2.5 },
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          alignItems="flex-start"
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            {Icon && (
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1.25,
                  backgroundColor: "primary.50",
                  color: "primary.700",
                  display: "grid",
                  placeItems: "center",
                  "& svg": { fontSize: 18 },
                }}
              >
                <Icon />
              </Box>
            )}
            <Box>
              {title && (
                <Typography
                  sx={{
                    fontFamily: theme.tokens.typography.display,
                    fontSize: "1rem",
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                    color: "text.primary",
                    lineHeight: 1.3,
                  }}
                >
                  {title}
                </Typography>
              )}
              {subtitle && (
                <Typography
                  variant="caption"
                  sx={{ color: "text.secondary", display: "block", mt: 0.25 }}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Stack>
          {action}
        </Stack>

        <Box
          sx={{
            flex: 1,
            minHeight: height || 280,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {children}
        </Box>

        {footer && (
          <Box
            sx={{
              mt: 2,
              py: 1.25,
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

ChartCard.propTypes = {
  icon: PropTypes.elementType,
  title: PropTypes.node,
  subtitle: PropTypes.node,
  action: PropTypes.node,
  footer: PropTypes.node,
  children: PropTypes.node,
  height: PropTypes.number,
  sx: PropTypes.object,
};
