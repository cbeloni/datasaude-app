import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Chip, Grid, Skeleton, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircleOutline";
import WarningIcon from "@mui/icons-material/WarningAmberOutlined";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import ReportIcon from "@mui/icons-material/ReportGmailerrorred";
import UpdateIcon from "@mui/icons-material/Update";
import KPICard from "components/Card/KPICard";
import PageHeader from "components/Card/PageHeader";

const QUALITY_MAP = {
  "N1 - BOA": { tone: "success", icon: CheckCircleIcon, label: "Boa" },
  "N2 - MODERADA": { tone: "warning", icon: WarningIcon, label: "Moderada" },
  "N3 - RUIM": { tone: "error", icon: PriorityHighIcon, label: "Ruim" },
  "N4 - MUITO RUIM": { tone: "rose", icon: ReportIcon, label: "Muito ruim" },
};

const FALLBACK = { tone: "neutral", icon: WarningIcon, label: "Indisponível" };

const Legend = () => {
  const theme = useTheme();
  const items = [
    { tone: "success", label: "N1 — Boa", color: theme.palette.success.main },
    {
      tone: "warning",
      label: "N2 — Moderada",
      color: theme.palette.warning.main,
    },
    { tone: "error", label: "N3 — Ruim", color: theme.palette.error.main },
    {
      tone: "rose",
      label: "N4 — Muito ruim",
      color: theme.tokens.palette.rose[500],
    },
  ];

  return (
    <Stack
      direction="row"
      spacing={1.5}
      flexWrap="wrap"
      useFlexGap
      sx={{ rowGap: 1 }}
    >
      {items.map((item) => (
        <Chip
          key={item.label}
          label={item.label}
          size="small"
          variant="outlined"
          sx={{
            fontWeight: 500,
            borderColor: "divider",
            "& .MuiChip-label": { px: 1.25 },
            "&::before": {
              content: '""',
              display: "inline-block",
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: item.color,
              marginInlineStart: 8,
              marginInlineEnd: -2,
            },
          }}
        />
      ))}
    </Stack>
  );
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/api/v1/poluentes/cetesb?persist=false`
      )
      .then((response) => {
        if (!cancelled) setData(response.data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Erro ao carregar dados");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const cards = data?.Payload || [];
  const isLoading = !data && !error;

  return (
    <Box>
      <PageHeader
        eyebrow="Qualidade do ar"
        title="Estações CETESB"
        description="Indicadores em tempo real das estações de monitoramento. Cada cartão representa uma estação e seu nível de qualidade do ar."
        actions={<Legend />}
      />

      <Grid container spacing={2.5}>
        {isLoading &&
          Array.from({ length: 8 }).map((_, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <Skeleton
                variant="rounded"
                height={172}
                sx={{ borderRadius: 2 }}
              />
            </Grid>
          ))}

        {error && (
          <Grid item xs={12}>
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                backgroundColor: "error.50",
                color: "error.700",
                border: (t) => `1px solid ${t.palette.divider}`,
              }}
            >
              <Typography variant="subtitle2">
                Não foi possível carregar os dados das estações.
              </Typography>
              <Typography variant="caption">{error}</Typography>
            </Box>
          </Grid>
        )}

        {!isLoading && !error && cards.length === 0 && (
          <Grid item xs={12}>
            <Box sx={{ p: 4, textAlign: "center", color: "text.secondary" }}>
              <Typography variant="body2">
                Nenhuma estação retornou dados no momento.
              </Typography>
            </Box>
          </Grid>
        )}

        {cards.map((card) => {
          const q = QUALITY_MAP[card.qualidade] || FALLBACK;
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={card.nome}>
              <KPICard
                icon={q.icon}
                tone={q.tone}
                label={card.nome}
                value={q.label}
                description={`${card.endereco} — ${card.municipio}`}
                footer={
                  <>
                    <UpdateIcon />
                    <span>Atualizado em {card.data}</span>
                  </>
                }
              >
                <Stack direction="row" spacing={3}>
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary", display: "block" }}
                    >
                      Poluente
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {card.poluente || "—"}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary", display: "block" }}
                    >
                      Índice
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {card.indice ?? "—"}
                    </Typography>
                  </Box>
                </Stack>
              </KPICard>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
