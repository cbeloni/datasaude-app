import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, Grid, Stack, TextField, Typography } from "@mui/material";
import InsertChartIcon from "@mui/icons-material/InsertChartOutlined";
import UpdateIcon from "@mui/icons-material/Update";
import { format } from "date-fns";
import moment from "moment";

import PageHeader from "components/Card/PageHeader";
import ChartCard from "components/Card/ChartCard";
import isValidDate from "utils/validators";
import CustomLineGraph from "components/Graph/CustomLineGraph";
import LoadingModal from "components/Progress/LoadingModal";
import CidSelect from "components/Select/CidSelect";
import TipoSelect from "./TipoSelect";
import DatePicker from "components/DataPicker/ReactDatePicker";

const base_url_api_ml = `${process.env.REACT_APP_API_ML_URL}`;

export default function Previsao() {
  const [cid, setCid] = useState("TODOS");
  const [tipo, setTipo] = useState("ATENDIMENTO");
  const [previsaoPath, setPrevisaoPath] = useState("5");
  const [sazonalidade, setSazonalidade] = useState("180");
  const [xLabels, setXLabels] = useState([]);
  const [previsao, setPrevisao] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [dateRange, setDateRange] = useState([
    moment("01/01/2022", "DD/MM/YYYY").toDate(),
    moment("31/12/2023", "DD/MM/YYYY").toDate(),
  ]);

  const getRangeText = () => {
    if (!dateRange || isValidDate(dateRange)) return "Período não selecionado";
    const [from, to] = dateRange;
    return `Dados de ${format(from, "dd/MM/yyyy")} até ${format(
      to,
      "dd/MM/yyyy"
    )}`;
  };

  const treinarModelo = () =>
    axios.post(
      `${base_url_api_ml}/api/temporal/treinar`,
      {},
      {
        params: {
          qtd_dias_previsao: previsaoPath,
          qtd_dias_sazonalidade: sazonalidade,
          cid,
          tipo_analise: tipo,
        },
      }
    );

  const getPrevisoes = async () => {
    try {
      const [from, to] = dateRange;
      const response = await axios.get(
        `${base_url_api_ml}/api/temporal/previsao`,
        {
          params: {
            cid,
            tipo_analise: tipo,
            dt_previsao_inicial: format(from, "yyyy-MM-dd"),
            dt_previsao_final: format(to, "yyyy-MM-dd"),
          },
        }
      );

      const datas = response.data.map((item) => new Date(item.data));
      setXLabels(datas);
      setHistorico(response.data.map((item) => item.valor_historico));
      setPrevisao(response.data.map((item) => item.valor_previsao));
    } catch (error) {
      console.error("Erro ao buscar previsões:", error);
    }
  };

  const handleTreinarClick = async () => {
    try {
      setModalIsOpen(true);
      await treinarModelo();
      await getPrevisoes();
    } catch (error) {
      alert(`Erro: ${error.message}`);
    } finally {
      setModalIsOpen(false);
    }
  };

  useEffect(() => {
    if (dateRange && dateRange.length === 2 && dateRange[0] && dateRange[1]) {
      getPrevisoes();
    }
  }, [tipo, cid, dateRange]);

  return (
    <Box>
      <PageHeader
        eyebrow="Previsão"
        title="Modelo temporal de demanda"
        description="Treine o modelo, ajuste sazonalidade e horizonte de previsão e compare valores históricos com os previstos."
      />

      <Grid container spacing={2.5}>
        <Grid item xs={12}>
          <ChartCard
            icon={InsertChartIcon}
            title="Pacientes atendidos × previsto"
            subtitle="Comparação histórico × previsão"
            footer={
              <>
                <UpdateIcon />
                <span>{getRangeText()}</span>
              </>
            }
            height={360}
          >
            <Stack spacing={2}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                    md: "repeat(5, 1fr) auto",
                  },
                  gap: 1.5,
                  alignItems: "end",
                }}
              >
                <TextField
                  label="Dias de previsão"
                  type="number"
                  size="small"
                  value={previsaoPath}
                  onChange={(e) => setPrevisaoPath(e.target.value)}
                />
                <TextField
                  label="Dias de sazonalidade"
                  type="number"
                  size="small"
                  value={sazonalidade}
                  onChange={(e) => setSazonalidade(e.target.value)}
                />
                <TipoSelect
                  tipo={tipo}
                  handleTipoChange={(e) => setTipo(e.target.value)}
                />
                <CidSelect
                  cid={cid}
                  handleCidChange={(e) => setCid(e.target.value)}
                />
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", display: "block", mb: 0.5 }}
                  >
                    Data de atendimento
                  </Typography>
                  <DatePicker value={dateRange} onChange={setDateRange} />
                </Box>
                <Button
                  variant="contained"
                  size="medium"
                  onClick={handleTreinarClick}
                >
                  Calcular
                </Button>
              </Box>

              <CustomLineGraph
                xLabels={xLabels}
                previsao={previsao}
                historico={historico}
              />
            </Stack>
          </ChartCard>
        </Grid>
      </Grid>

      <LoadingModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
      />
    </Box>
  );
}
