export const TABLE_TAB_PERMISSIONS = [
  { value: "paciente", label: "Pacientes", code: "table.patients.view" },
  {
    value: "poluente-online",
    label: "Poluente online",
    code: "table.pollutants.view",
  },
  { value: "ibge-v1", label: "IBGE v1", code: "table.ibge_v1.view" },
  { value: "ibge-v2", label: "IBGE", code: "table.ibge_v2.view" },
];

export const MAP_TAB_PERMISSIONS = [
  {
    value: "map_dinamic",
    label: "Mapa dinâmico",
    code: "maps.dynamic.view",
  },
  {
    value: "map_bronquiolite",
    label: "Bronquiolite",
    code: "maps.bronquiolite.view",
  },
  {
    value: "map_estatic",
    label: "Mapa estático",
    code: "maps.static.view",
  },
  { value: "map_ibge", label: "Mapa IBGE", code: "maps.ibge.view" },
  {
    value: "map_ibge_v2",
    label: "Mapa IBGE V2",
    code: "maps.ibge_v2.view",
  },
  {
    value: "map_bronquiolite_vsr",
    label: "Bronquiolite VSR",
    code: "maps.bronquiolite_vsr.view",
  },
];

export const TAB_PERMISSION_GROUPS = [
  {
    label: "Tabelas",
    parentCode: "table.view",
    items: TABLE_TAB_PERMISSIONS,
  },
  {
    label: "Mapas",
    parentCode: "maps.view",
    items: MAP_TAB_PERMISSIONS,
  },
];
