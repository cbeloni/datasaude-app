import {
  createColumn,
  ColumnDataType,
  ColumnSortDirection,
} from "tubular-common";

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
  createColumn("DT_NASC", {
    dataType: ColumnDataType.Date,
    label: "Data Nascimento",
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
  createColumn("TP_SEXO", {
    dataType: ColumnDataType.String,
    label: "Sexo",
  }),
  createColumn("latitude", {
    dataType: ColumnDataType.String,
    label: "Latitude",
  }),
  createColumn("longitude", {
    dataType: ColumnDataType.String,
    label: "Longitude",
  }),
  createColumn("poluente", {
    dataType: ColumnDataType.String,
    label: "Poluente",
  }),
  createColumn("indice_interpolado", {
    dataType: ColumnDataType.String,
    label: "Indice Interpolado",
  }),
];

export { pacienteColumns };
