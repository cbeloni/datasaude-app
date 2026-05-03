import React from "react";
import PropTypes from "prop-types";
import { Box, Card, Grid, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import InsertChartIcon from "@mui/icons-material/InsertChartOutlined";
import UpdateIcon from "@mui/icons-material/Update";
import { format } from "date-fns";
import moment from "moment";

import PageHeader from "components/Card/PageHeader";
import ChartCard from "components/Card/ChartCard";
import DatePicker from "components/DataPicker/ReactDatePicker";
import CustomGraphBars from "components/Graph/CustomGraph";
import CustomCidGraphBars from "components/Graph/CustomCidGraph";
import CustomInternacaGraphBars from "components/Graph/CustomInternacaoGraph";
import CustomLeitosGraph from "components/Graph/CustomLeitosGraph";
import isValidDate from "utils/validators";

const formatRange = (range) => {
  if (!range || isValidDate(range)) return "Período não selecionado";
  const [from, to] = range;
  return `Dados de ${format(from, "dd/MM/yyyy")} até ${format(
    to,
    "dd/MM/yyyy"
  )}`;
};

const FilterBar = ({ value, onChange }) => {
  const theme = useTheme();
  return (
    <Card
      variant="outlined"
      sx={{
        p: 2,
        mb: 3,
        backgroundColor: theme.palette.background.paper,
        position: "relative",
        zIndex: 5,
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems={{ xs: "flex-start", md: "center" }}
      >
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            variant="overline"
            sx={{
              color: "text.secondary",
              fontSize: "0.6875rem",
              letterSpacing: "0.14em",
            }}
          >
            Filtro
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.primary", fontWeight: 500, mt: 0.25 }}
          >
            Selecione o período de análise
          </Typography>
        </Box>
        <Box sx={{ flexShrink: 0 }}>
          <DatePicker value={value} onChange={onChange} />
        </Box>
      </Stack>
    </Card>
  );
};

export default function Indicadores() {
  const [dateRange, setDateRange] = React.useState([
    moment("01/01/2022", "DD/MM/YYYY").toDate(),
    moment("28/02/2022", "DD/MM/YYYY").toDate(),
  ]);

  const rangeText = formatRange(dateRange);
  const Footer = (
    <>
      <UpdateIcon />
      <span>{rangeText}</span>
    </>
  );

  const charts = [
    {
      title: "Pacientes por data de atendimento",
      subtitle: "Volume de atendimentos por dia",
      Component: CustomGraphBars,
    },
    {
      title: "Pacientes por internação e alta",
      subtitle: "Movimentação de leitos no período",
      Component: CustomInternacaGraphBars,
    },
    {
      title: "Pacientes por CID",
      subtitle: "Distribuição por código diagnóstico",
      Component: CustomCidGraphBars,
    },
    {
      title: "Ocupação de leitos",
      subtitle: "Disponibilidade ao longo do período",
      Component: CustomLeitosGraph,
    },
  ];

  return (
    <Box>
      <PageHeader
        eyebrow="Indicadores"
        title="Painel de saúde pública"
        description="Volume de atendimentos, internações, distribuição por CID e ocupação de leitos no período selecionado."
      />

      <FilterBar value={dateRange} onChange={setDateRange} />

      <Grid container spacing={2.5}>
        {charts.map(({ title, subtitle, Component }) => (
          <Grid item xs={12} md={6} key={title}>
            <ChartCard
              icon={InsertChartIcon}
              title={title}
              subtitle={subtitle}
              footer={Footer}
            >
              <Component dateRange={dateRange} />
            </ChartCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

FilterBar.propTypes = {
  value: PropTypes.array,
  onChange: PropTypes.func,
};
