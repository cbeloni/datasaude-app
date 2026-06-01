import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Box, Grid, Skeleton, Stack, Typography } from "@mui/material";
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

const LEGEND_ITEMS = [
  {
    code: "N1",
    label: "Boa",
    quality: "N1 - BOA",
    gradient: ["#10B981", "#047857"],
  },
  {
    code: "N2",
    label: "Moderada",
    quality: "N2 - MODERADA",
    gradient: ["#F59E0B", "#B45309"],
  },
  {
    code: "N3",
    label: "Ruim",
    quality: "N3 - RUIM",
    gradient: ["#F43F5E", "#BE123C"],
  },
  {
    code: "N4",
    label: "Muito ruim",
    quality: "N4 - MUITO RUIM",
    gradient: ["#E11D48", "#881337"],
  },
];

const Legend = ({ cards = [] }) => {
  const theme = useTheme();
  const counts = cards.reduce((acc, c) => {
    acc[c.qualidade] = (acc[c.qualidade] || 0) + 1;
    return acc;
  }, {});

  return (
    <Stack
      direction="row"
      spacing={1.25}
      flexWrap="wrap"
      useFlexGap
      sx={{ rowGap: 1 }}
    >
      {LEGEND_ITEMS.map((item) => {
        const [g1, g2] = item.gradient;
        const count = counts[item.quality] || 0;
        return (
          <Stack
            key={item.code}
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              pl: 0.5,
              pr: 1.25,
              py: 0.5,
              borderRadius: 999,
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: "background.paper",
            }}
          >
            <Box
              sx={{
                px: 0.875,
                py: 0.25,
                borderRadius: 999,
                background: `linear-gradient(135deg, ${g1}, ${g2})`,
                color: "#fff",
                fontSize: "0.6875rem",
                fontWeight: 700,
                letterSpacing: "0.04em",
                lineHeight: 1.4,
                minWidth: 26,
                textAlign: "center",
                boxShadow: `0 2px 6px -2px ${g2}66`,
              }}
            >
              {item.code}
            </Box>
            <Typography
              variant="body2"
              sx={{ fontSize: "0.8125rem", fontWeight: 500 }}
            >
              {item.label}
            </Typography>
            {count > 0 && (
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontVariantNumeric: "tabular-nums",
                  fontWeight: 600,
                  ml: 0.25,
                }}
              >
                · {count}
              </Typography>
            )}
          </Stack>
        );
      })}
    </Stack>
  );
};

Legend.propTypes = {
  cards: PropTypes.array,
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
        actions={<Legend cards={cards} />}
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
