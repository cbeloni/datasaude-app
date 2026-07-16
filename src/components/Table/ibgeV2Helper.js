const DEFAULT_PRIORITY_COLUMNS = [
  "cd_setor",
  "situacao",
  "cd_sit",
  "cd_tipo",
  "area_km2",
  "cd_regiao",
  "nm_regiao",
  "cd_uf",
  "nm_uf",
  "nm_mun",
  "percentual_domicios_ocupados",
  "percentual_pessoas",
];

const formatColumnLabel = (field) =>
  field
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const buildDynamicColumns = (fields) =>
  fields.map((field) => ({
    field,
    headerName: formatColumnLabel(field),
    width: Math.max(140, Math.min(280, field.length * 12)),
  }));

const buildFormulaColumns = (formulas) =>
  formulas.map((formula) => ({
    field: formula.nome.trim().toLowerCase().replace(/\s+/g, "_"),
    headerName: formula.nome,
    width: 180,
  }));

const getDefaultSelectedColumns = (fields) => {
  const defaults = DEFAULT_PRIORITY_COLUMNS.filter((field) =>
    fields.includes(field)
  );

  if (defaults.length > 1) {
    return defaults;
  }

  if (defaults.length === 1 && defaults[0] === "cd_setor") {
    return fields.slice(0, Math.min(fields.length, 5));
  }

  return fields.slice(0, Math.min(fields.length, 10));
};

export {
  DEFAULT_PRIORITY_COLUMNS,
  formatColumnLabel,
  buildDynamicColumns,
  buildFormulaColumns,
  getDefaultSelectedColumns,
};
