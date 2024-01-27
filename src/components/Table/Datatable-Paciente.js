import React, { useState } from "react";
import { DataGrid, ToolbarOptions } from "tubular-react";
import {
  createColumn,
  ColumnDataType,
  LocalStorage,
  ColumnSortDirection,
} from "tubular-common";
import DatePicker from "components/DataPicker/ReactDatePicker";
import { Input } from "@mui/material";
import { Box, Button, Typography } from "@material-ui/core";
import RowRadioButtonsPeriodo from "components/RadioGroup/RadioGroupPeriodo";

const pacienteColumns = [
  createColumn("id", {
    dataType: ColumnDataType.Numeric,
    filterable: false,
    isKey: true,
    label: "Id",
    sortDirection: ColumnSortDirection.Ascending,
    sortOrder: 1,
    sortable: false,
  }),
  createColumn("CD_ATENDIMENTO", {
    dataType: ColumnDataType.Numeric,
    filterable: false,
    label: "Código Atendimento",
  }),
  createColumn("NM_PACIENTE", {
    dataType: ColumnDataType.String,
    label: "Nome do Paciente",
  }),
  createColumn("DT_ATENDIMENTO", {
    dataType: ColumnDataType.Date,
    label: "Data Atendimento",
  }),
  createColumn("TP_ATENDIMENTO", {
    dataType: ColumnDataType.String,
    label: "Tipo Atendimento",
  }),
  createColumn("DS_ORI_ATE", {
    dataType: ColumnDataType.String,
    label: "Origem Atendimento",
  }),
  createColumn("DS_LEITO", {
    dataType: ColumnDataType.String,
    label: "Leito",
  }),
  createColumn("DT_PREVISTA_ALTA", {
    dataType: ColumnDataType.Date,
    label: "Data Prevista Alta",
  }),
  createColumn("DT_ALTA", {
    dataType: ColumnDataType.Date,
    label: "Data Alta",
  }),
  createColumn("CD_SGRU_CID", {
    dataType: ColumnDataType.String,
    label: "Código SGRU CID",
  }),
  createColumn("CD_CID", {
    dataType: ColumnDataType.String,
    label: "Código CID",
  }),
  createColumn("DS_CID", {
    dataType: ColumnDataType.String,
    label: "Descrição CID",
  }),
  createColumn("SN_INTERNADO", {
    dataType: ColumnDataType.String,
    label: "Internado",
  }),
  createColumn("DS_ENDERECO", {
    dataType: ColumnDataType.String,
    label: "Endereço",
  }),
  createColumn("NR_ENDERECO", {
    dataType: ColumnDataType.Numeric,
    label: "Número do Endereço",
  }),
  createColumn("NM_BAIRRO", {
    dataType: ColumnDataType.String,
    label: "Bairro",
  }),
  createColumn("NR_CEP", {
    dataType: ColumnDataType.Numeric,
    label: "CEP",
  }),
  createColumn("DT_NASC", {
    dataType: ColumnDataType.Date,
    label: "Data Nascimento",
  }),
  createColumn("IDADE", {
    dataType: ColumnDataType.String,
    label: "Idade",
  }),
  createColumn("TP_SEXO", {
    dataType: ColumnDataType.String,
    label: "Sexo",
  }),
];

function DataTablePacienteComponent() {
  const [selectedPeriod, setSelectedPeriod] = useState("anos");

  const handleChangePeriodo = (event) => {
    setSelectedPeriod(event.target.value);
  };

  const handleButtonClick = () => {
    alert(`Período selecionado: ${selectedPeriod}`);
  };

  const toolbarOptions = new ToolbarOptions({
    searchText: false,
    exportButton: false,
    printButton: false,
    customItems: (
      <div>
        <Box display="flex" justifyContent="space-between">
          <div style={{ padding: "10px" }}>
            <Typography>Data Atendimento:</Typography>
            <DatePicker></DatePicker>
          </div>
          <div style={{ paddingLeft: "50px" }}>
            <Typography>Idade:</Typography>
            <Input type="number" id="idade" name="idade"></Input>
          </div>
          <div
            style={{
              paddingLeft: "20px",
              paddingRight: "50px",
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
        dataSource="http://datasaude-api.beloni.dev.br/api/v1/paciente/listar/ "
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
