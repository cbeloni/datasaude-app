import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { Box, Button, Slider, Stack, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import DatePicker from "components/DataPicker/ReactDatePicker";
import RowRadioButtonsPeriodo from "components/RadioGroup/RadioGroupPeriodo";
import CidSelect from "components/Select/CidSelect";
import SexoSelect from "components/Select/SexoSelect";
import { pacienteColumns } from "./PacienteHelper";

const URL_BASE = `${process.env.REACT_APP_API_URL}/api/v1/paciente/listar?`;

export default function DataTablePacienteComponent() {
  const [selectedPeriod, setSelectedPeriod] = useState("anos");
  const [dateRange, setDateRange] = useState([null, null]);
  const [cid, setCid] = useState("TODOS");
  const [sexo, setSexo] = useState("TODOS");
  const [idadeSlider, setIdadeSlider] = useState([0, 18]);
  const [idadeSliderChanged, setIdadeSliderChanged] = useState(false);
  const [maxRangeSlider, setMaxRangeSlider] = useState(18);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });

  const url = useMemo(() => {
    const [from, to] = dateRange;
    const params = [];
    if (from && to) {
      params.push(`dt_atendimento_inicial=${format(from, "yyyy/MM/dd")}`);
      params.push(`dt_atendimento_final=${format(to, "yyyy/MM/dd")}`);
    }
    if (selectedPeriod === "anos" && idadeSliderChanged) {
      params.push(
        `idade_anos_ini=${idadeSlider[0]}&idade_anos_fim=${idadeSlider[1]}`
      );
    }
    if (selectedPeriod === "meses" && idadeSliderChanged) {
      params.push(
        `idade_meses_ini=${idadeSlider[0]}&idade_meses_fim=${idadeSlider[1]}`
      );
    }
    if (cid && cid !== "TODOS") params.push(`cid=${encodeURIComponent(cid)}`);
    if (sexo && sexo !== "TODOS") params.push(`sexo=${sexo}`);
    return `${URL_BASE}${params.join("&")}`;
    // eslint-disable-next-line
  }, [dateRange, idadeSlider, idadeSliderChanged, selectedPeriod, cid, sexo]);

  const fetchData = async (targetUrl) => {
    try {
      setLoading(true);
      const response = await axios.get(targetUrl);
      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.Payload || response.data?.data || [];
      const withIds = data.map((row, idx) => ({ id: row.id ?? idx, ...row }));
      setRows(withIds);
    } catch (err) {
      console.error("Erro ao carregar pacientes:", err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(url);
  }, [url]);

  const handleChangePeriodo = (event) => {
    const v = event.target.value;
    setSelectedPeriod(v);
    if (v === "anos") {
      setMaxRangeSlider(18);
      setIdadeSlider([0, 18]);
    } else {
      setMaxRangeSlider(24);
      setIdadeSlider([0, 24]);
    }
  };

  return (
    <Stack spacing={2}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            lg:
              "minmax(340px, 1.6fr) minmax(120px, 0.8fr) minmax(180px, 1.2fr) minmax(140px, 0.8fr) minmax(220px, 1.4fr) auto",
          },
          gap: 2,
          alignItems: "center",
        }}
      >
        <DatePicker value={dateRange} onChange={setDateRange} />

        <SexoSelect
          sexo={sexo}
          handleSexoChange={(e) => setSexo(e.target.value)}
        />
        <CidSelect cid={cid} handleCidChange={(e) => setCid(e.target.value)} />

        <Box>
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", display: "block", mb: 0.5 }}
          >
            Unidade da idade
          </Typography>
          <RowRadioButtonsPeriodo
            value={selectedPeriod}
            onChange={handleChangePeriodo}
          />
        </Box>

        <Box>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Idade: {idadeSlider[0]} – {idadeSlider[1]} {selectedPeriod}
          </Typography>
          <Slider
            value={idadeSlider}
            onChange={(_, v) => {
              setIdadeSlider(v);
              setIdadeSliderChanged(true);
            }}
            valueLabelDisplay="auto"
            min={0}
            max={maxRangeSlider}
            sx={{ mt: 1 }}
          />
        </Box>

        <Button
          variant="contained"
          onClick={() => fetchData(url)}
          sx={{ height: 40, whiteSpace: "nowrap" }}
        >
          Filtrar
        </Button>
      </Box>

      <Box sx={{ width: "100%" }}>
        <DataGrid
          autoHeight
          rows={rows}
          columns={pacienteColumns}
          loading={loading}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 25, 50, 100]}
          density="compact"
          disableRowSelectionOnClick
          sx={{
            border: 0,
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "background.default",
              borderBottom: 1,
              borderColor: "divider",
            },
            "& .MuiDataGrid-cell": {
              fontSize: "0.8125rem",
            },
          }}
        />
      </Box>
    </Stack>
  );
}
