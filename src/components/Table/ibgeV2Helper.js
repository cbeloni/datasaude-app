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
  // Sempre mostrar as 5 primeiras colunas como padrão
  return fields.slice(0, Math.min(fields.length, 5));
};

export {
  formatColumnLabel,
  buildDynamicColumns,
  buildFormulaColumns,
  getDefaultSelectedColumns,
};
