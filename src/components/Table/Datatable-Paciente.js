import React, { useState } from "react";
import { DataGrid, ToolbarOptions } from "tubular-react";
import { LocalStorage } from "tubular-common";
import DatePicker from "components/DataPicker/ReactDatePicker";
import Slider from "@mui/material/Slider";
import { Box, Button, Typography } from "@material-ui/core";
import RowRadioButtonsPeriodo from "components/RadioGroup/RadioGroupPeriodo";
import { pacienteColumns } from "./PacienteHelper";
import { format } from "date-fns";
import "./styles.css";
import CidSelect from "components/Select/CidSelect";
import SexoSelect from "components/Select/SexoSelect";

function DataTablePacienteComponent() {
  const [selectedPeriod, setSelectedPeriod] = useState("anos");
  const [dateRange, setDateRange] = useState([null, null]);
  const URL_BASE = `${process.env.REACT_APP_API_URL}/api/v1/paciente/listar?`;
  const [url, setUrl] = useState(URL_BASE);
  const [idade] = useState("");
  const [cid, setCid] = useState("TODOS");
  const [sexo, setSexo] = useState("TODOS");
  const [anosSlider, setAnosSlider] = React.useState([0, 18]);
  const [maxRangeSlider, setMaxRangeSlider] = React.useState(18);

  const handleChangeSlider = (event, newValue) => {
    setAnosSlider(newValue);
    console.log("Anos: ", newValue);
  };
  const handleCidChange = (event) => {
    setCid(event.target.value);
  };
  const handleSexoChange = (event) => {
    setSexo(event.target.value);
  };
  const handleChangePeriodo = (event) => {
    setSelectedPeriod(event.target.value);
    if (event.target.value === "anos") {
      setMaxRangeSlider(18);
      setAnosSlider([0, 18]);
    } else {
      setMaxRangeSlider(24);
      setAnosSlider([0, 24]);
    }
  };

  const handleButtonClick = () => {
    const [dataInicial, dataFinal] = dateRange;
    let filtros = "";
    if (dataInicial && dataFinal) {
      let dataInicialFormatada = format(dataInicial, "yyyy/MM/dd");
      let dataFinalFormatada = format(dataFinal, "yyyy/MM/dd");
      console.log("dataInicial", dataInicialFormatada);
      console.log("dataFinal", dataFinalFormatada);
      filtros += `dt_atendimento_inicial=${dataInicialFormatada}&dt_atendimento_final=${dataFinalFormatada}`;
    }
    if (selectedPeriod === "anos" && idade) {
      filtros += `&idade_anos=${idade}`;
    }
    if (selectedPeriod === "meses" && idade) {
      filtros += `&idade_meses=${idade}`;
    }
    if (cid && cid != "TODOS") {
      filtros += `&cid=${cid}`;
    }
    if (sexo && sexo != "TODOS") {
      filtros += `&sexo=${sexo}`;
    }

    let urlChanged = `${URL_BASE}${filtros}`;
    console.log("Resultado url alterada ", urlChanged);
    setUrl(urlChanged);
  };

  const atualizaData = (data) => {
    setDateRange(data);
    console.log(data);
  };

  const toolbarOptions = new ToolbarOptions({
    searchText: false,
    exportButton: true,
    printButton: false,
    customItems: (
      <div>
        <Box className="estiloHorizontal" justifyContent="space-between">
          <div style={{ padding: "10px", paddingLeft: "40px" }}>
            <Typography>Data Atendimento:</Typography>
            <DatePicker value={dateRange} onChange={atualizaData}></DatePicker>
          </div>
          <div style={{ paddingLeft: "40px" }}>
            <SexoSelect
              sexo={sexo}
              handleSexoChange={handleSexoChange}
            ></SexoSelect>
          </div>
          <div style={{ paddingLeft: "40px" }}>
            <CidSelect cid={cid} handleCidChange={handleCidChange}></CidSelect>
          </div>
          <div
            style={{
              paddingLeft: "60px",
              paddingTop: "10px",
              maxWidth: "100px",
            }}
          >
            <RowRadioButtonsPeriodo
              value={selectedPeriod}
              onChange={handleChangePeriodo}
            ></RowRadioButtonsPeriodo>
          </div>
          <div style={{ paddingTop: "20px", paddingRight: "20px" }}>
            <Box
              sx={{
                width: {
                  xs: 200,
                  md: 300,
                },
              }}
            >
              <Typography id="non-linear-slider" gutterBottom>
                Selecionado de {anosSlider[0]} até {anosSlider[1]}
                &nbsp;{selectedPeriod}:
              </Typography>
              <Slider
                getAriaLabel={() => "Temperature range"}
                value={anosSlider}
                onChange={handleChangeSlider}
                valueLabelDisplay="auto"
                step={1}
                min={0}
                max={maxRangeSlider}
              />
            </Box>
          </div>
          <div style={{ padding: "20px", paddingTop: "40px" }}>
            <Button
              color="primary"
              variant="contained"
              onClick={handleButtonClick}
            >
              Filtrar
            </Button>
          </div>
        </Box>
      </div>
    ),
  });

  return (
    <div>
      <DataGrid
        key={url}
        dataSource={url}
        gridName="Tubular-React"
        columns={pacienteColumns}
        storage={new LocalStorage()}
        onPageChange={(params) => {
          console.log("===params===", params);
        }}
        toolbarOptions={toolbarOptions}
      />
    </div>
  );
}

export default DataTablePacienteComponent;
