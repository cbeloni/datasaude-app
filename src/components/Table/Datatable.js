import React from "react";
import { DataGrid } from "tubular-react";
import {
  createColumn,
  LocalStorage,
  ColumnDataType,
  ColumnSortDirection,
} from "tubular-common";

const columns = [
  createColumn("id", {
    dataType: ColumnDataType.Numeric,
    filterable: false,
    isKey: true,
    label: "Id",
    sortDirection: ColumnSortDirection.Ascending,
    sortOrder: 1,
    sortable: false,
  }),
  createColumn("nome", {
    dataType: ColumnDataType.String,
    label: "Nome",
  }),
  createColumn("situacao_rede", {
    dataType: ColumnDataType.String,
    label: "Situação Rede",
  }),
  createColumn("qualidade", {
    dataType: ColumnDataType.String,
    label: "Qualidade do Ar",
  }),
  createColumn("indice", {
    dataType: ColumnDataType.String,
    label: "Índice Poluente",
  }),
  createColumn("poluente", {
    dataType: ColumnDataType.String,
    label: "Tipo Poluente",
  }),
  createColumn("endereco", {
    dataType: ColumnDataType.String,
    label: "Endereço coleta",
  }),
  createColumn("data", {
    dataType: ColumnDataType.String,
    label: "Data coleta",
  }),
  createColumn("data_atual", {
    dataType: ColumnDataType.String,
    label: "Data Sistema",
  }),
];

function DataTableComponent() {
  return (
    <div>
      <DataGrid
        gridName="Tubular-React"
        columns={columns}
        dataSource="http://datasaude-api.beloni.dev.br/api/v1/poluentes"
        storage={new LocalStorage()}
        onPageChange={(params) => {
          console.log("===params===", params);
        }}
      />
    </div>
  );
}

export default DataTableComponent;
