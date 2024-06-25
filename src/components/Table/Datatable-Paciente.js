import React, { useState } from "react";
import { DataGrid, ToolbarOptions } from "tubular-react";
import { LocalStorage } from "tubular-common";
import DatePicker from "components/DataPicker/ReactDatePicker";
import { Input } from "@mui/material";
import { Box, Button, Typography } from "@material-ui/core";
import RowRadioButtonsPeriodo from "components/RadioGroup/RadioGroupPeriodo";
import { pacienteColumns } from "./PacienteHelper";
import { format } from "date-fns";
import "./styles.css";

function DataTablePacienteComponent() {
  const [selectedPeriod, setSelectedPeriod] = useState("anos");
  const [dateRange, setDateRange] = useState([null, null]);
  const URL_BASE =
    "https://datasaude-api.beloni.dev.br/api/v1/paciente/listar?";
  const [url, setUrl] = useState(URL_BASE);
  const [idade, setIdade] = useState("");

  const handleIdadeChange = (event) => {
    console.log(event.target.value);
    if (event.target.value >= 0) {
      setIdade(event.target.value);
      return;
    }
    setIdade("");
  };
  const handleChangePeriodo = (event) => {
    setSelectedPeriod(event.target.value);
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
    exportButton: false,
    printButton: false,
    customItems: (
      <div>
        <Box className="estiloHorizontal" justifyContent="space-between">
          <div style={{ padding: "10px", paddingLeft: "40px" }}>
            <Typography>Data Atendimento:</Typography>
            <DatePicker value={dateRange} onChange={atualizaData}></DatePicker>
          </div>
          <div style={{ paddingLeft: "40px" }}>
            <Typography>Idade:</Typography>
            <Input
              type="number"
              id="idade"
              name="idade"
              value={idade}
              onChange={handleIdadeChange}
            ></Input>
          </div>
          <div
            style={{
              paddingLeft: "20px",
              paddingRight: "40px",
              paddingTop: "10px",
            }}
          >
            <RowRadioButtonsPeriodo
              value={selectedPeriod}
              onChange={handleChangePeriodo}
            ></RowRadioButtonsPeriodo>
          </div>
          <div style={{ padding: "10px" }}>
            <Button color="primary" onClick={handleButtonClick}>
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
