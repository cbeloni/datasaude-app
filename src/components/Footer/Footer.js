import React from "react";
import { Box, Stack, Typography, Link } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function Footer() {
  const theme = useTheme();
  const year = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        mt: 4,
        py: 3,
        px: { xs: 2, md: 4 },
        borderTop: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
      >
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          © {year} DataSaúde · Plataforma de vigilância em saúde pública
        </Typography>
        <Stack direction="row" spacing={2}>
          <Link
            href="https://datasaude-app.beloni.dev.br"
            target="_blank"
            rel="noopener"
            underline="hover"
            sx={{
              fontSize: "0.75rem",
              color: "text.secondary",
              "&:hover": { color: "primary.main" },
            }}
          >
            Sobre
          </Link>
          <Link
            href="#"
            underline="hover"
            sx={{
              fontSize: "0.75rem",
              color: "text.secondary",
              "&:hover": { color: "primary.main" },
            }}
          >
            Privacidade
          </Link>
        </Stack>
      </Stack>
    </Box>
  );
}
