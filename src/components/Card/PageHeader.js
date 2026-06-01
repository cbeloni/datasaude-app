import React from "react";
import PropTypes from "prop-types";
import { Box, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function PageHeader({ eyebrow, title, description, actions }) {
  const theme = useTheme();
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={2}
      justifyContent="space-between"
      alignItems={{ xs: "flex-start", md: "flex-end" }}
      sx={{ mb: 3 }}
    >
      <Box sx={{ minWidth: 0 }}>
        {eyebrow && (
          <Typography
            variant="overline"
            sx={{
              color: "primary.main",
              fontSize: "0.6875rem",
              letterSpacing: "0.14em",
              fontWeight: 600,
            }}
          >
            {eyebrow}
          </Typography>
        )}
        {title && (
          <Typography
            sx={{
              fontFamily: theme.tokens.typography.display,
              fontSize: { xs: "1.625rem", md: "2rem" },
              fontWeight: 500,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              color: "text.primary",
              mt: 0.5,
            }}
          >
            {title}
          </Typography>
        )}
        {description && (
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", mt: 0.75, maxWidth: 640 }}
          >
            {description}
          </Typography>
        )}
      </Box>
      {actions && (
        <Stack direction="row" spacing={1.5} sx={{ flexShrink: 0 }}>
          {actions}
        </Stack>
      )}
    </Stack>
  );
}

PageHeader.propTypes = {
  eyebrow: PropTypes.node,
  title: PropTypes.node,
  description: PropTypes.node,
  actions: PropTypes.node,
};
