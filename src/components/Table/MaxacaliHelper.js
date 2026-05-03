const maxacaliBaseColumns = [
  { field: "id", headerName: "Id", width: 100 },
  { field: "cd_setor", headerName: "Código Setor", width: 190 },
  { field: "situacao", headerName: "Situação", width: 120 },
  { field: "cd_sit", headerName: "Código Situação", width: 150 },
  { field: "cd_tipo", headerName: "Código Tipo", width: 130 },
  { field: "area_km2", headerName: "Área km²", width: 120 },
  { field: "cd_regiao", headerName: "Código Região", width: 140 },
  { field: "nm_regiao", headerName: "Região", width: 130 },
  { field: "cd_uf", headerName: "Código UF", width: 110 },
  { field: "nm_uf", headerName: "UF", width: 130 },
  { field: "cd_mun", headerName: "Código Município", width: 160 },
  { field: "nm_mun", headerName: "Município", width: 160 },
  { field: "cd_dist", headerName: "Código Distrito", width: 150 },
  { field: "nm_dist", headerName: "Distrito", width: 140 },
  { field: "cd_subdist", headerName: "Código Subdistrito", width: 170 },
  { field: "nm_subdist", headerName: "Subdistrito", width: 150 },
  { field: "cd_bairro", headerName: "Código Bairro", width: 140 },
  { field: "nm_bairro", headerName: "Bairro", width: 140 },
  { field: "cd_nu", headerName: "Código NU", width: 130 },
  { field: "nm_nu", headerName: "NU", width: 130 },
  { field: "cd_fcu", headerName: "Código FCU", width: 130 },
  { field: "nm_fcu", headerName: "FCU", width: 130 },
  { field: "cd_aglom", headerName: "Código Aglomeração", width: 190 },
  { field: "nm_aglom", headerName: "Aglomeração", width: 280 },
  { field: "cd_rgint", headerName: "Código RGINT", width: 140 },
  { field: "nm_rgint", headerName: "RGINT", width: 160 },
  { field: "cd_rgi", headerName: "Código RGI", width: 130 },
  { field: "nm_rgi", headerName: "RGI", width: 140 },
  { field: "cd_concurb", headerName: "Código Conurbação", width: 180 },
  { field: "nm_concurb", headerName: "Conurbação", width: 180 },
];

const maxacaliCaracteristicaColumns = [
  { field: "v0001", headerName: "V0001", width: 110 },
  { field: "v0002", headerName: "V0002", width: 110 },
  { field: "v0003", headerName: "V0003", width: 110 },
  { field: "v0004", headerName: "V0004", width: 110 },
  { field: "v0005", headerName: "V0005", width: 110 },
  { field: "v0006", headerName: "V0006", width: 110 },
  { field: "v0007", headerName: "V0007", width: 110 },
  { field: "v00047", headerName: "V00047", width: 110 },
  {
    field: "calculo_um",
    headerName: "Calculo Um",
    width: 140,
  },
];

const maxacaliColumns = [
  ...maxacaliBaseColumns,
  ...maxacaliCaracteristicaColumns,
  { field: "created_at", headerName: "Criado em", width: 170 },
  { field: "updated_at", headerName: "Atualizado em", width: 170 },
];

export { maxacaliBaseColumns, maxacaliCaracteristicaColumns, maxacaliColumns };
