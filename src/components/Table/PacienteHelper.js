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

export { pacienteColumns };
